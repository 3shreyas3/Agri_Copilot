import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  Truck, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Fuel, 
  Navigation, 
  RefreshCw, 
  PhoneCall, 
  FileText, 
  ShieldCheck, 
  Sliders, 
  ArrowRight,
  ExternalLink,
  Sparkles,
  Layers
} from 'lucide-react';
import { 
  DISTRICT_COORDINATES, 
  INTERSTATE_TERMINAL_MANDIS, 
  LIVE_COMMODITY_PRICING, 
  getInterstateRedirectionAnalysis 
} from '../data/marketRedirectionData';
import { KARNATAKA_DISTRICTS } from '../data/agriKnowledge';

export default function MarketRedirectionMap({
  defaultDistrict = 'Davanagere',
  defaultCrop = 'Maize / Corn',
  defaultPopularity = 75,
  defaultLotSize = 80,
  onNavigateToForm,
  onNavigateToReport
}) {
  const [selectedDistrict, setSelectedDistrict] = useState(defaultDistrict);
  const [selectedCrop, setSelectedCrop] = useState(defaultCrop);
  const [regionalPopularity, setRegionalPopularity] = useState(defaultPopularity);
  const [lotSizeQuintals, setLotSizeQuintals] = useState(defaultLotSize);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [isLiveRefreshing, setIsLiveRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('Just now');
  const [priceNoise, setPriceNoise] = useState(0);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);

  // Compute live analysis
  const analysis = getInterstateRedirectionAnalysis({
    originDistrict: selectedDistrict,
    cropName: selectedCrop,
    regionalPopularity,
    lotSizeQuintals
  });

  // Apply subtle simulated live price fluctuation when refreshed
  const routesWithLiveNoise = analysis.routes.map(route => {
    const livePrice = route.destinationLivePrice + priceNoise;
    const grossSpread = livePrice - analysis.effectiveLocalPrice;
    const netArbitrage = grossSpread - route.freightCostPerQtl;
    const totalGain = Math.round(netArbitrage * lotSizeQuintals);
    return {
      ...route,
      destinationLivePrice: livePrice,
      grossSpreadPerQtl: grossSpread,
      netArbitragePerQtl: netArbitrage,
      totalNetGainForLot: totalGain
    };
  });

  // Set default selected route to the highest arbitrage route
  useEffect(() => {
    if (routesWithLiveNoise.length > 0 && !selectedRouteId) {
      setSelectedRouteId(routesWithLiveNoise[0].mandiId);
    }
  }, [routesWithLiveNoise, selectedRouteId]);

  // Handle live price refresh
  const handleRefreshPrices = () => {
    setIsLiveRefreshing(true);
    setTimeout(() => {
      // Small simulated tick +/- Rs 15
      const tick = Math.floor(Math.random() * 31) - 15;
      setPriceNoise(tick);
      setIsLiveRefreshing(false);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastRefreshed(timeStr);
    }, 600);
  };

  // Initialize and update Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not already done
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [analysis.originCoords[0], analysis.originCoords[1]],
        zoom: 6,
        zoomControl: true,
        scrollWheelZoom: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers and lines
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    polylinesRef.current.forEach(l => map.removeLayer(l));
    polylinesRef.current = [];

    const originLat = analysis.originCoords[0];
    const originLng = analysis.originCoords[1];

    // 1. Add Origin Farm Marker with custom pulsating CSS DivIcon
    const originIcon = L.divIcon({
      className: 'custom-origin-pin',
      html: `
        <div style="
          background: #10b981;
          color: white;
          border-radius: 9999px;
          padding: 6px 10px;
          font-weight: 800;
          font-size: 11px;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.6);
          border: 2px solid #ffffff;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        ">
          <span style="font-size: 14px;">🌾</span>
          <span>${selectedDistrict} (Farm Origin)</span>
        </div>
      `,
      iconSize: [160, 32],
      iconAnchor: [80, 16]
    });

    const originMarker = L.marker([originLat, originLng], { icon: originIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: sans-serif; padding: 4px;">
          <strong style="color: #065f46; font-size: 13px;">📍 Origin: ${selectedDistrict}, Karnataka</strong>
          <div style="font-size: 11px; color: #4b5563; margin-top: 4px;">
            Crop: <strong>${selectedCrop}</strong><br/>
            Regional Popularity: <strong>${regionalPopularity}%</strong> (${analysis.isGlutOver70 ? 'Over-supply Glut' : 'Normal Supply'})<br/>
            Local Mandi Price: <strong>₹${analysis.effectiveLocalPrice}/qtl</strong>
          </div>
        </div>
      `);

    markersRef.current.push(originMarker);

    // 2. Add Destination Interstate Mandis and Connect Routes
    const allBoundsCoords = [[originLat, originLng]];

    routesWithLiveNoise.forEach((route, idx) => {
      const isSelected = selectedRouteId === route.mandiId;
      const isTopRoute = idx === 0;

      allBoundsCoords.push(route.coords);

      // Destination Custom HTML Marker
      const destIcon = L.divIcon({
        className: 'custom-dest-pin',
        html: `
          <div style="
            background: ${isTopRoute ? '#047857' : isSelected ? '#1d4ed8' : '#334155'};
            color: white;
            border-radius: 12px;
            padding: 5px 9px;
            font-weight: 700;
            font-size: 11px;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            border: 2px solid ${isTopRoute ? '#34d399' : '#ffffff'};
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
          ">
            <div style="display: flex; align-items: center; gap: 3px;">
              <span>${isTopRoute ? '🏆' : '🏛'}</span>
              <span>${route.shortName}</span>
            </div>
            <div style="color: #fef08a; font-size: 10px; font-weight: 800;">
              ₹${route.destinationLivePrice}/qtl (${route.netArbitragePerQtl >= 0 ? '+' : ''}₹${route.netArbitragePerQtl} net)
            </div>
          </div>
        `,
        iconSize: [140, 42],
        iconAnchor: [70, 21]
      });

      const destMarker = L.marker(route.coords, { icon: destIcon })
        .addTo(map)
        .on('click', () => {
          setSelectedRouteId(route.mandiId);
        })
        .bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <strong style="color: #1e293b; font-size: 13px;">${route.mandiName}</strong>
            <div style="font-size: 11px; color: #475569; margin-top: 5px; line-height: 1.4;">
              Highway: <strong>${route.highway}</strong><br/>
              Distance: <strong>${route.distanceKm} km (~ ${route.transitHours} hrs)</strong><br/>
              Live Mandi Rate: <strong style="color: #047857;">₹${route.destinationLivePrice}/qtl</strong> (${route.priceTrend})<br/>
              Freight Cost: <strong>₹${route.freightCostPerQtl}/qtl</strong><br/>
              <span style="color: #059669; font-weight: 800; font-size: 12px;">
                Net Profit Gain: +₹${route.netArbitragePerQtl}/qtl (+₹${route.totalNetGainForLot.toLocaleString()} total)
              </span>
            </div>
          </div>
        `);

      markersRef.current.push(destMarker);

      // Polyline route from origin to destination
      const polyline = L.polyline([[originLat, originLng], route.coords], {
        color: isTopRoute ? '#059669' : isSelected ? '#2563eb' : '#94a3b8',
        weight: isTopRoute || isSelected ? 4 : 2.5,
        opacity: isTopRoute || isSelected ? 0.9 : 0.5,
        dashArray: isTopRoute ? null : '6, 8'
      }).addTo(map);

      polyline.bindTooltip(
        `🚚 ${route.highway}: ${route.distanceKm} km • Net +₹${route.netArbitragePerQtl}/qtl`,
        { sticky: true, className: 'route-tooltip' }
      );

      polyline.on('click', () => {
        setSelectedRouteId(route.mandiId);
      });

      polylinesRef.current.push(polyline);
    });

    // Fit map bounds smoothly
    if (allBoundsCoords.length > 1) {
      map.fitBounds(allBoundsCoords, { padding: [40, 40], maxZoom: 8 });
    }

  }, [selectedDistrict, selectedCrop, regionalPopularity, priceNoise, selectedRouteId]);

  const activeRoute = routesWithLiveNoise.find(r => r.mandiId === selectedRouteId) || routesWithLiveNoise[0];

  return (
    <div className="space-y-6">

      {/* ========================================================= */}
      {/* 1. OVER-SUPPLY GLUT NOTIFICATION & TRIGGER STATUS BANNER  */}
      {/* ========================================================= */}
      {analysis.isGlutOver70 ? (
        <div className="bg-gradient-to-r from-rose-900 via-amber-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-xl border-2 border-rose-500/50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-rose-500/30 border border-rose-400 text-rose-300 shrink-0">
                <AlertTriangle className="w-7 h-7 animate-pulse text-amber-300" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500 text-white shadow-xs">
                    🚨 Interstate Redirection Activated
                  </span>
                  <span className="text-xs font-bold text-amber-300 bg-amber-900/40 px-2 py-0.5 rounded border border-amber-500/30">
                    Regional Popularity: {regionalPopularity}% (&gt; 70% Over-supply Alert)
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  High District Saturation in <span className="text-amber-300">{selectedDistrict}</span>: Transport Recommended!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                  Over 70% of farmers in your district are cultivating <strong>{selectedCrop}</strong>. At harvest time, high local volume creates a market glut and drops local prices to ~<strong>₹{analysis.glutDepressedPrice}/qtl</strong>. 
                  Redirecting your harvest to deficit terminal mandis in <strong>Tamil Nadu, Maharashtra, or Telangana</strong> will protect your profit margins.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-rose-500/30 shrink-0 text-center md:text-right">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top Arbitrage Net Profit</div>
              <div className="text-2xl font-black text-emerald-400 mt-0.5">
                +₹{routesWithLiveNoise[0]?.netArbitragePerQtl}/qtl
              </div>
              <div className="text-[11px] text-emerald-300 font-semibold">
                +₹{routesWithLiveNoise[0]?.totalNetGainForLot.toLocaleString()} on {lotSizeQuintals} Qtl truckload
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-lg border border-emerald-500/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                    Balanced Regional Supply
                  </span>
                  <span className="text-xs text-slate-300">
                    Regional Popularity: {regionalPopularity}% (&le; 70% Normal)
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Local District Mandis Offer Steady Prices
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  Production in <strong>{selectedDistrict}</strong> is well balanced. Local mandis offer healthy absorption without steep price drops. You can still compare and transport to other states below if the net profit gain outweighs freight costs.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-2xl border border-emerald-500/30 text-center md:text-right shrink-0">
              <div className="text-[10px] uppercase font-bold text-slate-400">Local Mandi Benchmark</div>
              <div className="text-xl font-extrabold text-white mt-0.5">₹{analysis.effectiveLocalPrice}/qtl</div>
              <div className="text-[10px] text-emerald-400">Steady Auction Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. LIVE INTERACTIVE FILTER & POPULARITY SIMULATION SLIDER  */}
      {/* ========================================================= */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>Market Simulation & Real-time Settings</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>e-NAM Feed: <strong className="text-slate-700">{lastRefreshed}</strong></span>
            </div>

            <button
              onClick={handleRefreshPrices}
              disabled={isLiveRefreshing}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isLiveRefreshing ? 'animate-spin' : ''}`} />
              <span>{isLiveRefreshing ? 'Updating...' : 'Refresh Live Mandi Rates'}</span>
            </button>
          </div>

        </div>

        {/* Input Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          
          {/* Origin District */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Origin District (Farm)</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
            >
              {KARNATAKA_DISTRICTS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Crop Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Crop Cultivated</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
            >
              {Object.keys(LIVE_COMMODITY_PRICING).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Regional Popularity % Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-600">Regional Popularity (%)</label>
              <span className={`text-xs font-extrabold px-2 py-0.2 rounded ${
                regionalPopularity > 70 
                  ? 'bg-rose-100 text-rose-700 font-mono' 
                  : 'bg-emerald-100 text-emerald-800 font-mono'
              }`}>
                {regionalPopularity}% {regionalPopularity > 70 ? '⚠️ High' : '✓ Normal'}
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="95"
              step="1"
              value={regionalPopularity}
              onChange={(e) => setRegionalPopularity(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>20% Low</span>
              <span className="font-bold text-rose-600">&gt; 70% Over-supply</span>
              <span>95% Extreme</span>
            </div>
          </div>

          {/* Shipment Lot Size */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Shipment Size (Quintals)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="10"
                max="500"
                step="5"
                value={lotSizeQuintals}
                onChange={(e) => setLotSizeQuintals(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                (~{(lotSizeQuintals * 0.1).toFixed(1)} MT)
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. ARBITRAGE FINANCIAL METRICS SUMMARY CARDS              */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Local Mandi Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Local Mandi Price ({selectedDistrict})
          </div>
          <div className="text-2xl font-black text-slate-800 mt-1">
            ₹{analysis.effectiveLocalPrice}
            <span className="text-xs font-normal text-slate-500"> /qtl</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {analysis.isGlutOver70 ? '📉 Depressed by regional over-supply' : '⚖️ Standard localized auction rate'}
          </p>
        </div>

        {/* Top Destination Mandi */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/80 p-4 rounded-2xl border border-emerald-300">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center justify-between">
            <span>Top Interstate Mandi</span>
            <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold">Recommended</span>
          </div>
          <div className="text-2xl font-black text-emerald-950 mt-1">
            ₹{activeRoute.destinationLivePrice}
            <span className="text-xs font-normal text-emerald-700"> /qtl</span>
          </div>
          <p className="text-[11px] text-emerald-800 font-semibold mt-1">
            {activeRoute.mandiName} ({activeRoute.priceTrend} today)
          </p>
        </div>

        {/* Net Gain After Freight */}
        <div className="bg-emerald-900 text-white p-4 rounded-2xl border border-emerald-700 shadow-sm">
          <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
            Net Arbitrage Gain (After Freight)
          </div>
          <div className="text-2xl font-black text-emerald-300 mt-1">
            +₹{activeRoute.netArbitragePerQtl}
            <span className="text-xs font-normal text-emerald-200"> /qtl</span>
          </div>
          <p className="text-[11px] text-emerald-100/80 mt-1">
            Deducting ₹{activeRoute.freightCostPerQtl}/qtl diesel, toll & freight
          </p>
        </div>

        {/* Total Lot Profit */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/70 p-4 rounded-2xl border border-amber-300">
          <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
            Total Extra Profit ({lotSizeQuintals} Qtl Lot)
          </div>
          <div className="text-2xl font-black text-amber-950 mt-1">
            +₹{activeRoute.totalNetGainForLot.toLocaleString()}
          </div>
          <p className="text-[11px] text-amber-800 font-semibold mt-1">
            +{activeRoute.roiPercentage}% gain vs selling locally in {selectedDistrict}
          </p>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 4. INTERACTIVE LEAFLET ROUTE MAP                          */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                Interstate Highway Navigation & Real-Time Mandi Map
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live National Highway routes from <strong>{selectedDistrict}</strong> to interstate agricultural terminal hubs. Click any route or marker to inspect details.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              Live Agmarknet GPS
            </span>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative">
          <div 
            ref={mapContainerRef} 
            className="w-full h-[460px] sm:h-[520px] bg-slate-100 z-10"
          />

          {/* Floating Selected Route Card on top of Map */}
          {activeRoute && (
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-20 bg-slate-900/90 text-white p-4 rounded-2xl shadow-2xl backdrop-blur-md border border-emerald-500/40 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                  Selected Highway Route
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {activeRoute.distanceKm} km • ~{activeRoute.transitHours}h
                </span>
              </div>
              <h4 className="text-sm font-black text-white">{activeRoute.mandiName}</h4>
              <div className="text-xs text-slate-300 mt-1">
                Via: <strong>{activeRoute.highway}</strong>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-700/80 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Live Wholesale Rate</div>
                  <div className="font-extrabold text-emerald-300">₹{activeRoute.destinationLivePrice}/qtl</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Net Extra Earnings</div>
                  <div className="font-extrabold text-amber-300">+₹{activeRoute.totalNetGainForLot.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ========================================================= */}
      {/* 5. INTERSTATE MANDI ROUTE COMPARISON CARDS               */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-700" />
            <h3 className="font-extrabold text-lg text-slate-900">
              Ranked Interstate Mandi Destinations for {selectedCrop}
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Sorted by Highest Net Profit Gain
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routesWithLiveNoise.map((route, idx) => {
            const isSelected = selectedRouteId === route.mandiId;
            const isBest = idx === 0;

            return (
              <div
                key={route.mandiId}
                onClick={() => setSelectedRouteId(route.mandiId)}
                className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-50/50 border-2 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isBest && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white">
                            🏆 Best Net Return
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {route.state}
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 mt-1">
                        {route.mandiName}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-lg font-black text-emerald-700">
                        ₹{route.destinationLivePrice}
                        <span className="text-xs font-normal text-slate-500"> /qtl</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600">
                        {route.priceTrend} today
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {route.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Highway Distance</div>
                      <div className="font-bold text-slate-800">{route.distanceKm} km</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Est. Transit</div>
                      <div className="font-bold text-slate-800">~{route.transitHours} Hours</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Freight / Tolls</div>
                      <div className="font-bold text-slate-800">₹{route.freightCostPerQtl}/qtl</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Net Profit Margin</div>
                    <div className="text-sm font-black text-emerald-700">
                      +₹{route.netArbitragePerQtl}/qtl (+₹{route.totalNetGainForLot.toLocaleString()})
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRouteId(route.mandiId);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900'
                    }`}
                  >
                    <span>{isSelected ? 'Viewing on Map' : 'Select Route'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 6. LOGISTICS, E-WAY BILL & HIGHWAY COMPLIANCE CHECKLIST   */}
      {/* ========================================================= */}
      <div className="bg-slate-900 text-white p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
          <h4 className="font-extrabold text-base text-white uppercase tracking-wider">
            Interstate Transport & Legal Compliance Guide for Farmers
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-1.5">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>GST e-Way Bill Exemption</span>
            </div>
            <p className="leading-relaxed text-slate-400">
              Under GST Rule 138(14), raw agricultural produce transported by farmers is <strong>100% exempt from GST e-Way bill</strong>. Carry your farmer ID / RTC / Pahani extract.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-1.5">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <Truck className="w-4 h-4" />
              <span>Interstate Toll & FASTag Lanes</span>
            </div>
            <p className="leading-relaxed text-slate-400">
              Commercial transport trucks require standard commercial FASTag. Multi-axle trucks on NH 48 and NH 44 travel seamlessly without manual checkpost stops.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-1.5">
            <div className="font-bold text-teal-300 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4" />
              <span>e-NAM Logistics Assistance</span>
            </div>
            <p className="leading-relaxed text-slate-400">
              Call the official e-NAM toll-free farmer logistics helpline at <strong>1800-270-0224</strong> for pre-arranged return loads and truck aggregation rates.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-800">
          <span className="text-slate-400">
            Official Portals: <a href="https://www.enam.gov.in/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline font-bold">e-NAM National Portal</a> • <a href="https://fruits.karnataka.gov.in/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline font-bold">Karnataka FRUITS</a>
          </span>
          <div className="flex items-center gap-2">
            {onNavigateToForm && (
              <button
                onClick={onNavigateToForm}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold transition"
              >
                ← Back to Farm Form
              </button>
            )}
            {onNavigateToReport && (
              <button
                onClick={onNavigateToReport}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition"
              >
                View Full Advisory Report →
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
