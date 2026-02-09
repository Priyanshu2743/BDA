import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell
} from "recharts";
import { 
  Briefcase, TrendingUp, Users, AlertTriangle, CheckCircle, 
  Zap, Target, MapPin, Calculator, MousePointer, Shield, Globe, 
  Sliders, DollarSign, Clock, ShoppingBag, Truck, CreditCard
} from "lucide-react";
import "./App.css";

// --- 1. PRODUCT CATALOG (NEW FEATURE) ---
const PRODUCT_CATALOG = {
  "Micro-Loans": {
    type: "Fintech",
    icon: <CreditCard size={14}/>,
    ltv: 2500, // Lifetime Value per user
    base_conv: 1.0, // Harder to convert
    dna_focus: "Social Proof", // Relies on trust
    insight: "Requires high social trust. Fear of 'Debt Traps' is the barrier."
  },
  "Tractor Rental": {
    type: "Agri-Tech",
    icon: <Truck size={14}/>,
    ltv: 15000, // High Ticket
    base_conv: 0.2, // Very hard to convert
    dna_focus: "Tech Literacy", // Needs app usage skills
    insight: "High friction. Needs 'Harvest' timing and tech-savvy farmers."
  },
  "Premium Tea": {
    type: "FMCG",
    icon: <ShoppingBag size={14}/>,
    ltv: 450, // Low Ticket, High Volume
    base_conv: 4.5, // Easier to convert
    dna_focus: "Risk Appetite", // Aspiration / Trying new things
    insight: "Impulse buy. 'Aspirational' tone works best. Digital reach is effective."
  }
};

// --- 2. DISTRICT DATABASE ---
const DISTRICT_DATA = {
  "Hisar": {
    region: "North", state: "Haryana", crop: "Wheat/Cotton", lang: "Haryanvi",
    trust_anchor: "Arhatiyas (Commission Agents)",
    dna: [
      { subject: 'Tech Literacy', A: 65, fullMark: 100 },
      { subject: 'Credit Hunger', A: 90, fullMark: 100 },
      { subject: 'Inst. Trust', A: 30, fullMark: 100 },
      { subject: 'Social Proof', A: 85, fullMark: 100 },
      { subject: 'Risk Appetite', A: 70, fullMark: 100 },
    ],
    insight: "Cash-rich farmers. Skeptical of apps, but high ticket size if trust is established via agents."
  },
  "Ludhiana": {
    region: "North", state: "Punjab", crop: "Wheat/Machinery", lang: "Punjabi",
    trust_anchor: "Local Co-ops / Dealer Networks",
    dna: [
      { subject: 'Tech Literacy', A: 75, fullMark: 100 },
      { subject: 'Credit Hunger', A: 95, fullMark: 100 }, // Needs capital for machines
      { subject: 'Inst. Trust', A: 60, fullMark: 100 },
      { subject: 'Social Proof', A: 80, fullMark: 100 },
      { subject: 'Risk Appetite', A: 90, fullMark: 100 }, // Entrepreneurial
    ],
    insight: "High aspiration. 'Status' matters. Marketing should emphasize 'Progress' and 'Scale'."
  },
  "Varanasi": {
    region: "North", state: "Uttar Pradesh", crop: "Textiles/Tourism", lang: "Bhojpuri/Hindi",
    trust_anchor: "Community Elders / Weaver Guilds",
    dna: [
      { subject: 'Tech Literacy', A: 45, fullMark: 100 },
      { subject: 'Credit Hunger', A: 60, fullMark: 100 },
      { subject: 'Inst. Trust', A: 40, fullMark: 100 },
      { subject: 'Social Proof', A: 95, fullMark: 100 },
      { subject: 'Risk Appetite', A: 30, fullMark: 100 },
    ],
    insight: "Very traditional. Digital-only fails 100%. Needs religious/cultural semantic alignment."
  },

  // SOUTH INDIA
  "Coimbatore": {
    region: "South", state: "Tamil Nadu", crop: "Cotton/Textiles", lang: "Kongu Tamil",
    trust_anchor: "Trade Unions / Co-ops",
    dna: [
      { subject: 'Tech Literacy', A: 85, fullMark: 100 },
      { subject: 'Credit Hunger', A: 70, fullMark: 100 },
      { subject: 'Inst. Trust', A: 80, fullMark: 100 },
      { subject: 'Social Proof', A: 60, fullMark: 100 },
      { subject: 'Risk Appetite', A: 75, fullMark: 100 },
    ],
    insight: "High literacy. Open to app-based lending if UI is in vernacular Tamil and transparent."
  },
  "Guntur": {
    region: "South", state: "Andhra Pradesh", crop: "Chillies/Tobacco", lang: "Telugu",
    trust_anchor: "Mandi Leaders",
    dna: [
      { subject: 'Tech Literacy', A: 70, fullMark: 100 },
      { subject: 'Credit Hunger', A: 85, fullMark: 100 }, // Cash crop volatility
      { subject: 'Inst. Trust', A: 50, fullMark: 100 },
      { subject: 'Social Proof', A: 75, fullMark: 100 },
      { subject: 'Risk Appetite', A: 80, fullMark: 100 }, // High risk takers
    ],
    insight: "Speculative market. Farmers take risks. Products offering 'High Yield/Return' work best."
  },
  "Ernakulam": {
    region: "South", state: "Kerala", crop: "Spices/Remittance", lang: "Malayalam",
    trust_anchor: "Family/Church/Mosque Networks",
    dna: [
      { subject: 'Tech Literacy', A: 95, fullMark: 100 }, // Highest
      { subject: 'Credit Hunger', A: 40, fullMark: 100 }, // Cash rich
      { subject: 'Inst. Trust', A: 70, fullMark: 100 },
      { subject: 'Social Proof', A: 60, fullMark: 100 },
      { subject: 'Risk Appetite', A: 40, fullMark: 100 }, // Conservative
    ],
    insight: "Difficult market. High skepticism. Only 'Gold Standard' brands work. Peer validation is key."
  },

  // WEST INDIA
  "Rajkot": {
    region: "West", state: "Gujarat", crop: "Groundnut/SME", lang: "Gujarati",
    trust_anchor: "Bania / Trade Networks",
    dna: [
      { subject: 'Tech Literacy', A: 80, fullMark: 100 },
      { subject: 'Credit Hunger', A: 65, fullMark: 100 },
      { subject: 'Inst. Trust', A: 85, fullMark: 100 },
      { subject: 'Social Proof', A: 90, fullMark: 100 },
      { subject: 'Risk Appetite', A: 60, fullMark: 100 }, // Calculated risk
    ],
    insight: "Business mindset. Use terms like 'Munafa' (Profit) and 'Bachat' (Savings). Value-conscious."
  },
  "Nashik": {
    region: "West", state: "Maharashtra", crop: "Grapes/Onions", lang: "Marathi",
    trust_anchor: "Shetkari Sanghatana (Farmer Unions)",
    dna: [
      { subject: 'Tech Literacy', A: 60, fullMark: 100 },
      { subject: 'Credit Hunger', A: 80, fullMark: 100 },
      { subject: 'Inst. Trust', A: 55, fullMark: 100 },
      { subject: 'Social Proof', A: 85, fullMark: 100 },
      { subject: 'Risk Appetite', A: 70, fullMark: 100 },
    ],
    insight: "Union-dominated. Marketing must be routed through local farmer leaders to succeed."
  },

  // EAST & CENTRAL INDIA
  "Madhubani": {
    region: "East", state: "Bihar", crop: "Paddy/Makhana", lang: "Maithili",
    trust_anchor: "SHG Leaders / Village Elders",
    dna: [
      { subject: 'Tech Literacy', A: 35, fullMark: 100 },
      { subject: 'Credit Hunger', A: 60, fullMark: 100 },
      { subject: 'Inst. Trust', A: 40, fullMark: 100 },
      { subject: 'Social Proof', A: 98, fullMark: 100 }, // Maximum social proof needed
      { subject: 'Risk Appetite', A: 20, fullMark: 100 },
    ],
    insight: "Zero digital trust. Only 'Phygital' (Physical Agent + Digital Backend) works here."
  },
  "Bardhaman": {
    region: "East", state: "West Bengal", crop: "Rice/Potato", lang: "Bengali",
    trust_anchor: "Local Party Office / Clubs",
    dna: [
      { subject: 'Tech Literacy', A: 55, fullMark: 100 },
      { subject: 'Credit Hunger', A: 70, fullMark: 100 },
      { subject: 'Inst. Trust', A: 60, fullMark: 100 },
      { subject: 'Social Proof', A: 80, fullMark: 100 },
      { subject: 'Risk Appetite', A: 40, fullMark: 100 },
    ],
    insight: "Intellectually driven. Marketing copy must be detailed and explain 'How it works' clearly."
  },
  "Indore": {
    region: "Central", state: "Madhya Pradesh", crop: "Soybean/Wheat", lang: "Hindi (Malwi)",
    trust_anchor: "Mandi Agents",
    dna: [
      { subject: 'Tech Literacy', A: 70, fullMark: 100 },
      { subject: 'Credit Hunger', A: 75, fullMark: 100 },
      { subject: 'Inst. Trust', A: 65, fullMark: 100 },
      { subject: 'Social Proof', A: 70, fullMark: 100 },
      { subject: 'Risk Appetite', A: 65, fullMark: 100 },
    ],
    insight: "The 'Middle India' proxy. Good test bed for products before national rollout."
  },

  // NORTH EAST
  "Kamrup": {
    region: "North East", state: "Assam", crop: "Tea/Areca Nut", lang: "Assamese",
    trust_anchor: "Gaon Burha (Village Headman)",
    dna: [
      { subject: 'Tech Literacy', A: 50, fullMark: 100 },
      { subject: 'Credit Hunger', A: 50, fullMark: 100 },
      { subject: 'Inst. Trust', A: 45, fullMark: 100 },
      { subject: 'Social Proof', A: 90, fullMark: 100 },
      { subject: 'Risk Appetite', A: 30, fullMark: 100 },
    ],
    insight: "Insular market. Outsiders mistrusted. Must partner with local tea garden associations."
  }
};

function App() {
  const [activeStep, setActiveStep] = useState(3); // Start at Strategy for demo
  const [selectedDistrict, setSelectedDistrict] = useState("Hisar");
  const [selectedProduct, setSelectedProduct] = useState("Micro-Loans"); // NEW STATE
  const [regionFilter, setRegionFilter] = useState("All");

  // --- SIMULATOR STATE ---
  const [totalBudget, setTotalBudget] = useState(50); // Lakhs
  const [allocDigital, setAllocDigital] = useState(30); 
  const [allocField, setAllocField] = useState(40); 
  const [allocCommunity, setAllocCommunity] = useState(30); 
  const [tone, setTone] = useState("Aspirational");
  const [timing, setTiming] = useState("Anytime");

  const [metrics, setMetrics] = useState({ reach: 0, cac: 0, conversion: 0, roi: 0, trustScore: 0 });

  // --- THE PHYSICS ENGINE (UPDATED FOR PRODUCTS) ---
  useEffect(() => {
    const dData = DISTRICT_DATA[selectedDistrict];
    const pData = PRODUCT_CATALOG[selectedProduct];
    if (!dData || !pData) return;

    // 1. Get DNA Scores
    const techLit = dData.dna.find(d => d.subject === 'Tech Literacy').A;
    const socialProofNeed = dData.dna.find(d => d.subject === 'Social Proof').A;
    const riskAppetite = dData.dna.find(d => d.subject === 'Risk Appetite').A;

    // 2. Calculate Reach (Product Specific Scaling)
    // FMCG reaches more people per rupee than Tractors
    let reachMultiplier = 1.0;
    if (selectedProduct === "Premium Tea") reachMultiplier = 3.0; // Cheap to reach
    if (selectedProduct === "Tractor Rental") reachMultiplier = 0.4; // Niche targeting

    const budgetDigital = totalBudget * (allocDigital / 100);
    const budgetField = totalBudget * (allocField / 100);
    const budgetCommunity = totalBudget * (allocCommunity / 100);

    const rawReach = ((budgetDigital * 2000) + (budgetField * 150) + (budgetCommunity * 500)) * reachMultiplier;

    // 3. Calculate Trust Score
    let trustGenerated = 
      (budgetField * 1.8) + 
      (budgetCommunity * 2.2) + 
      (budgetDigital * (techLit > 70 ? 0.6 : 0.05));
    
    let trustScore = Math.min(10, (trustGenerated / totalBudget) * 8);

    // 4. Calculate Conversion Rate (THE CORE LOGIC)
    let conv = pData.base_conv; // Start with product baseline

    // FACTOR A: DNA Match
    // If product needs "Tech Literacy" (Tractor) but District has low Tech Lit -> Penalty
    if (pData.dna_focus === "Tech Literacy") {
        conv *= (techLit / 50); // Multiplier
    } else if (pData.dna_focus === "Social Proof") {
        conv *= (trustScore / 5); // Needs trust to sell
    } else if (pData.dna_focus === "Risk Appetite") {
        conv *= (riskAppetite / 50); // Needs aspiration
    }

    // FACTOR B: Tone Match
    if (tone === "Aspirational" && riskAppetite > 60) conv *= 1.25;
    if (tone === "Safety" && riskAppetite < 40) conv *= 1.25;
    
    // FACTOR C: Timing (Crucial for Agri)
    if (pData.type === "Agri-Tech") {
        if (timing === "Harvest") conv *= 2.0; // Huge boost
        else conv *= 0.5; // Huge penalty for off-season
    } else if (pData.type === "FMCG") {
         // FMCG is less time sensitive, but festivals help
         if (timing === "Harvest") conv *= 1.1; 
    }

    // Clamp
    if (conv > 15) conv = 15; // Cap
    if (conv < 0.05) conv = 0.05; // Floor

    // 5. Financials
    const conversions = Math.round(rawReach * (conv / 100));
    const cac = Math.round((totalBudget * 100000) / (conversions || 1));
    const revenue = conversions * pData.ltv;
    const roi = Math.round(((revenue - (totalBudget * 100000)) / (totalBudget * 100000)) * 100);

    setMetrics({ reach: rawReach, cac, conversion: conv.toFixed(2), roi, trustScore: trustScore.toFixed(1) });

  }, [totalBudget, allocDigital, allocField, allocCommunity, tone, timing, selectedDistrict, selectedProduct]);

  const renderContent = () => {
    switch(activeStep) {
      case 1: return <PhaseProblem district={selectedDistrict} product={selectedProduct} />;
      case 2: return <PhaseIntelligence district={selectedDistrict} setDistrict={setSelectedDistrict} region={regionFilter} setRegion={setRegionFilter} />;
      case 3: return <PhaseStrategy 
          budget={totalBudget} setBudget={setTotalBudget}
          digital={allocDigital} setDigital={setAllocDigital}
          field={allocField} setField={setAllocField}
          comm={allocCommunity} setComm={setAllocCommunity}
          tone={tone} setTone={setTone}
          timing={timing} setTiming={setTiming}
          metrics={metrics} district={selectedDistrict}
          product={selectedProduct} setProduct={setSelectedProduct}
      />;
      case 4: return <PhaseImpact metrics={metrics} product={selectedProduct} />;
      default: return <PhaseProblem />;
    }
  };

  return (
    <div className="app-container">
      {/* SIDEBAR NAVIGATION */}
      <aside className="sidebar">
        <div className="brand">
          <Globe size={24} className="brand-icon" />
          <div>
            <h1>BharatAI</h1>
            <span className="tag">Strategy Sim v3.0</span>
          </div>
        </div>

        <nav className="nav-items">
          <button className={activeStep === 1 ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveStep(1)}>
            <AlertTriangle size={16}/> Problem Scope
          </button>
          <button className={activeStep === 2 ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveStep(2)}>
            <Users size={16}/> District Intel
          </button>
          <button className={activeStep === 3 ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveStep(3)}>
            <Calculator size={16}/> Strategy War Room
          </button>
          <button className={activeStep === 4 ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveStep(4)}>
            <TrendingUp size={16}/> Business Impact
          </button>
        </nav>

        <div className="client-context">
          <small>LIVE SIMULATION</small>
          <div className="context-row">
            <Target size={14} color="#94a3b8"/>
            <span>District: {selectedDistrict}</span>
          </div>
           {/* PRODUCT SELECTOR IN SIDEBAR */}
           <div style={{marginTop: '15px'}}>
              <label style={{fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold'}}>PRODUCT LINE</label>
              <select 
                className="product-select" 
                value={selectedProduct} 
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                  {Object.keys(PRODUCT_CATALOG).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
           </div>
        </div>
      </aside>

      <main className="main-viewport">{renderContent()}</main>
    </div>
  );
}

// --- SUB-COMPONENTS ---
// --- DYNAMIC PROBLEM ENGINE (UPDATED) ---
const getProblemContext = (product, district) => {
  const data = DISTRICT_DATA[district];
  
  // Extract DNA Scores for Math
  const techLit = data.dna.find(d => d.subject === 'Tech Literacy').A;
  const trust = data.dna.find(d => d.subject === 'Social Proof').A;
  const risk = data.dna.find(d => d.subject === 'Risk Appetite').A;

  // 1. FINTECH LOGIC (Micro-Loans)
  if (product === "Micro-Loans") {
    // Math: Low Trust = High CAC. Low Tech = High Drop-off.
    const dynCAC = Math.round(850 * (1 + ((100 - trust) / 100))); // E.g., Madhubani CAC > Hisar CAC
    const dynDropOff = Math.round(60 * (1 + ((100 - techLit) / 100))); 
    const fraudRisk = trust > 80 ? "High (Agent-Led)" : "Medium";

    return {
      title: "The 'Trust Deficit' Barrier",
      desc: `In ${district}, financial digitization faces a massive 'Cognitive Trust Gap'. Users fear hidden fees and lack of human recourse.`,
      kpi: [
        { label: "CAC", val: `₹${dynCAC}`, status: "bad", note: "vs ₹450 Avg" },
        { label: "App Drop-off", val: `${dynDropOff}%`, status: "bad", note: "Due to UI Friction" },
        { label: "Fraud Risk", val: fraudRisk, status: "bad", note: "Identity Theft" }
      ],
      friction: [
        { icon: <Shield size={16}/>, text: `Trust Gap: ${district} users rely on '${data.trust_anchor}'—not apps.` },
        { icon: <Zap size={16}/>, text: `Linguistic Mismatch: App uses formal terms, users speak ${data.lang}.` },
        { icon: <AlertTriangle size={16}/>, text: "Fear of 'Debt Traps': High anxiety around digital repayment." }
      ]
    };
  }

  // 2. AGRI-TECH LOGIC (Tractor Rental)
  if (product === "Tractor Rental") {
    // Math: High Risk Appetite = Lower Idle Time (Early Adopters)
    const idleTime = risk > 60 ? "6 Months" : "9 Months"; 
    const fulfillment = Math.round(40 * (techLit / 100) + 20); // Tech Lit drives booking success

    return {
      title: "The 'Asset Utilization' Trap",
      desc: `High CAPEX asset with extremely narrow usage windows in ${district}. The challenge is maximizing utilization during short harvest spikes.`,
      kpi: [
        { label: "Asset Idle Time", val: idleTime, status: "bad", note: "Off-Season" },
        { label: "Order Fulfilment", val: `${fulfillment}%`, status: "bad", note: "Booking Failures" },
        { label: "CAC", val: "₹2100", status: "bad", note: "Per Rental" }
      ],
      friction: [
        { icon: <Clock size={16}/>, text: `Timing Mismatch: Demand spikes only during ${data.crop.split('/')[0]} harvest.` },
        { icon: <MousePointer size={16}/>, text: `Tech Literacy: Farmers in ${district} struggle with complex booking UIs.` },
        { icon: <Truck size={16}/>, text: "Logistics: Last-mile delivery to remote fields is inconsistent." }
      ]
    };
  }

  // 3. FMCG LOGIC (Premium Tea)
  if (product === "Premium Tea") {
    // Math: Remote Regions = Higher Channel Cost
    const isRemote = district === "Kamrup" || district === "Madhubani";
    const channelCost = isRemote ? "45%" : "28%";
    const stockOuts = isRemote ? "Frequent" : "Occasional";

    return {
      title: "The 'Last-Mile' Leakage",
      desc: `In ${district}, the challenge is not demand, but efficient distribution. Traditional supply chains eat up margins.`,
      kpi: [
        { label: "Channel Cost", val: channelCost, status: "bad", note: "Margin Leakage" },
        { label: "Repeat Rate", val: "12%", status: "bad", note: "Brand Switch" },
        { label: "Stock-outs", val: stockOuts, status: "bad", note: "Supply Chain" }
      ],
      friction: [
        { icon: <MapPin size={16}/>, text: `Distribution: Remote villages in ${district} face frequent stock-outs.` },
        { icon: <DollarSign size={16}/>, text: "Price Sensitivity: Premium pricing clashes with local loose tea competitors." },
        { icon: <ShoppingBag size={16}/>, text: "Brand Relevance: 'Premium' positioning alienates value-conscious buyers." }
      ]
    };
  }
  
  // Default fallback
  return { 
      title: "Loading...", desc: "", kpi: [], friction: [] 
  };
};


const PhaseProblem = ({ district, product }) => {
  const context = getProblemContext(product, district);

  return (
    <div className="phase fade-in">
      <header>
        <h2><AlertTriangle className="icon-red"/> Problem Definition: {product}</h2>
        <p>{context.desc}</p>
      </header>
      
      <div className="grid-2">
        {/* LEFT: BASELINE PERFORMANCE */}
        <div className="card">
          <h3>Current Baseline Metrics</h3>
          <p className="sub-text">Status Quo Performance in {district}</p>
          
          <div className="kpi-row">
            {context.kpi.map((k, i) => (
              <div key={i} className={`kpi ${k.status}`}>
                <span>{k.label}</span>
                <strong>{k.val}</strong>
                {/* Add this line: */}
                <span className="kpi-note">{k.note}</span>
              </div>
            ))}
          </div>

          <div className="insight-box-red">
            <strong>Why it's failing:</strong> Current strategy treats {district} like an Urban Metro, ignoring local {DISTRICT_DATA[district].dna[1].subject} dynamics.
          </div>
        </div>

        {/* RIGHT: FRICTION MATRIX */}
        <div className="card">
          <h3>Strategic Friction Points</h3>
          <ul className="friction-list-advanced">
            {context.friction.map((f, i) => (
              <li key={i}>
                <div className="icon-box-small">{f.icon}</div>
                <div className="text-content">
                  <strong>Constraint {i+1}</strong>
                  <p>{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const PhaseIntelligence = ({ district, setDistrict, region, setRegion }) => {
  const data = DISTRICT_DATA[district];
  const regions = ["All", "North", "South", "East", "West", "North East"];
  
  const filteredDistricts = Object.keys(DISTRICT_DATA).filter(d => 
    region === "All" ? true : DISTRICT_DATA[d].region === region
  );

  return (
    <div className="phase fade-in">
      <header>
        <h2><Users className="icon-blue"/> District Intelligence Engine</h2>
        <p>Decoding the Behavioral DNA of <strong>{district}</strong>.</p>
      </header>

      <div className="control-bar-stack">
        <div className="filter-row">
          {regions.map(r => (
            <button key={r} className={region === r ? "filter-pill active" : "filter-pill"} onClick={() => setRegion(r)}>{r}</button>
          ))}
        </div>
        <div className="select-row">
          <label>Select District:</label>
          <select value={district} onChange={(e) => setDistrict(e.target.value)}>
            {filteredDistricts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header-row"><h3>Consumer Psychographics</h3><span className="badge-region">{data.region}</span></div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.dna}>
              <PolarGrid /><PolarAngleAxis dataKey="subject" /><PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name={district} dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3>Strategic Unlock Keys</h3>
          <div className="key-item"><span>Dominant Economy</span><strong>{data.crop}</strong></div>
          <div className="key-item"><span>Primary Language</span><strong>{data.lang}</strong></div>
          <div className="insight-box"><Zap size={16} /> {data.insight}</div>
        </div>
      </div>
    </div>
  );
};

const PhaseStrategy = ({ 
    budget, setBudget, 
    digital, setDigital, field, setField, comm, setComm,
    tone, setTone, timing, setTiming,
    metrics, district, product, setProduct
}) => {
  const dData = DISTRICT_DATA[district];
  const pData = PRODUCT_CATALOG[product];
  
  return (
    <div className="phase fade-in">
      <header>
        <h2><Calculator className="icon-orange"/> Advanced Strategy War Room</h2>
        <p>Configuring GTM for <strong>{product}</strong> in <strong>{district}</strong>.</p>
      </header>

      <div className="grid-2-Sim">
        <div className="card controls-panel">
          <h3><Sliders size={16}/> Campaign Levers</h3>

          {/* Product Selector in War Room too */}
          <div className="control-group">
            <div className="label-row"><label>Active Product</label></div>
            <div className="pill-group">
                 {Object.keys(PRODUCT_CATALOG).map(p => (
                     <button key={p} className={product === p ? "active" : ""} onClick={() => setProduct(p)}>{p}</button>
                 ))}
            </div>
            <div className="product-insight-small">
                {pData.icon} {pData.insight}
            </div>
          </div>

          <hr className="divider"/>

          <div className="control-group">
            <div className="label-row"><label><DollarSign size={14}/> Total Budget</label><strong>₹{budget} Lakhs</strong></div>
            <input type="range" min="10" max="200" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="slider-main" />
          </div>

          <div className="control-group">
            <label className="sub-label">Channel Mix (%)</label>
            <div className="slider-row"><span>Digital Ads</span><input type="range" value={digital} onChange={(e) => setDigital(Number(e.target.value))} /><span className="val">{digital}%</span></div>
            <div className="slider-row"><span>Field Agents</span><input type="range" value={field} onChange={(e) => setField(Number(e.target.value))} /><span className="val">{field}%</span></div>
            <div className="slider-row"><span>Community</span><input type="range" value={comm} onChange={(e) => setComm(Number(e.target.value))} /><span className="val">{comm}%</span></div>
          </div>

          <hr className="divider"/>

          <div className="tactical-row">
            <div className="tactic">
                <label><MousePointer size={14}/> Tone</label>
                <div className="pill-group">
                    <button className={tone === "Aspirational" ? "active" : ""} onClick={() => setTone("Aspirational")}>Growth 🚀</button>
                    <button className={tone === "Safety" ? "active" : ""} onClick={() => setTone("Safety")}>Safety 🛡️</button>
                </div>
            </div>
            <div className="tactic">
                <label><Clock size={14}/> Timing</label>
                <div className="pill-group">
                    <button className={timing === "Anytime" ? "active" : ""} onClick={() => setTiming("Anytime")}>Now</button>
                    <button className={timing === "Harvest" ? "active" : ""} onClick={() => setTiming("Harvest")}>Harvest 🌾</button>
                </div>
            </div>
          </div>
        </div>

        <div className="card outcomes-panel">
            <div className="panel-header">
                <h3>Predicted Performance</h3>
                <span className={metrics.roi > 0 ? "roi-badge pos" : "roi-badge neg"}>ROI: {metrics.roi}%</span>
            </div>
            
            <div className="score-grid">
                <div className="score-box"><span>Reach</span><h3>{(metrics.reach / 1000).toFixed(1)}k</h3></div>
                <div className="score-box"><span>Trust Score</span><h3 style={{color: metrics.trustScore > 6 ? '#10b981' : '#f59e0b'}}>{metrics.trustScore}/10</h3></div>
                <div className="score-box"><span>Conv. Rate</span><h3>{metrics.conversion}%</h3></div>
            </div>

            <div className="financial-box">
                <div className="fin-row"><span>CAC</span><strong style={{color: metrics.cac > (pData.ltv * 0.3) ? '#ef4444' : '#10b981'}}>₹{metrics.cac}</strong></div>
                <div className="fin-row"><span>Revenue</span><strong>₹{((metrics.reach * (metrics.conversion/100) * pData.ltv)/100000).toFixed(1)} L</strong></div>
            </div>

            <div className="ai-insight">
                <Zap size={16} fill="#f59e0b" stroke="none" />
                <p>
                    {metrics.roi < 0 
                    ? `Strategy Mismatch! ${product} relies on ${pData.dna_focus}. In ${district}, this strategy is failing.`
                    : `Strong Fit! Your mix aligns with the need for ${pData.dna_focus} in ${district}.`}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

const PhaseImpact = ({ metrics, product }) => (
  <div className="phase fade-in">
    <header>
      <h2><TrendingUp className="icon-green"/> Business Impact Comparison</h2>
      <p>Financial outcomes for <strong>{product}</strong>.</p>
    </header>
    <div className="grid-2">
      <div className="card">
        <h3>CAC Efficiency</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={[{ name: 'Industry Avg', value: PRODUCT_CATALOG[product].ltv * 0.4 }, { name: 'Your Sim', value: metrics.cac }]}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip cursor={{fill: 'transparent'}} />
            <Bar dataKey="value" radius={[5, 5, 0, 0]} barSize={60}>
               {[{ name: 'Industry Avg', value: 850 }, { name: 'Your Sim', value: metrics.cac }]
                .map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#94a3b8' : (entry.value < (PRODUCT_CATALOG[product].ltv * 0.3) ? '#10b981' : '#ef4444')} />
               ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card big-numbers">
        <h3>Final Simulation Outcome</h3>
        <div className="stat-block"><span>Total Conversions</span><h4>{(metrics.reach * (metrics.conversion/100)).toFixed(0)}</h4></div>
        <div className="stat-block"><span>Net Profit</span><h4 style={{color: metrics.roi > 0 ? '#10b981' : '#ef4444'}}>{metrics.roi > 0 ? 'Positive' : 'Negative'}</h4></div>
      </div>
    </div>
  </div>
);

export default App;