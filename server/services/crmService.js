import Deal from "../models/Deal.js";
import Lead from "../models/Lead.js";

const defaultLeads = [
  { name: "Avery Stone", company: "Apex Studio", email: "avery@apex.studio", score: 94, source: "Website", status: "Hot" },
  { name: "Mina Rahman", company: "CloudNest", email: "mina@cloudnest.io", score: 88, source: "Referral", status: "Qualified" },
  { name: "Ethan Brooks", company: "BrightFlow", email: "ethan@brightflow.co", score: 72, source: "LinkedIn", status: "Nurture" },
  { name: "Sofia Chen", company: "ScalePoint", email: "sofia@scalepoint.ai", score: 91, source: "Webinar", status: "Hot" },
  { name: "Noah Carter", company: "Northstar Labs", email: "noah@northstarlabs.com", score: 66, source: "Ads", status: "New" },
  { name: "Lina Patel", company: "OrbitStack", email: "lina@orbitstack.dev", score: 81, source: "Website", status: "Qualified" },
  { name: "Omar Hassan", company: "RevenueOps", email: "omar@revenueops.com", score: 58, source: "Referral", status: "New" },
  { name: "Grace Kim", company: "PulsePilot", email: "grace@pulsepilot.io", score: 76, source: "LinkedIn", status: "Nurture" },
];

const defaultDeals = [
  { title: "Apex dashboard rollout", company: "Apex Studio", owner: "Sarah", amount: "$12K", stage: "New" },
  { title: "Lead scoring pilot", company: "OrbitStack", owner: "Mia", amount: "$9K", stage: "New" },
  { title: "Enterprise reporting suite", company: "CloudNest", owner: "David", amount: "$28K", stage: "Discovery" },
  { title: "CRM migration", company: "Northstar Labs", owner: "Omar", amount: "$16K", stage: "Discovery" },
  { title: "Revenue intelligence sprint", company: "ScalePoint", owner: "Sarah", amount: "$21K", stage: "Proposal" },
  { title: "Executive KPI workspace", company: "RevenueOps", owner: "Mia", amount: "$18K", stage: "Negotiation" },
  { title: "Customer health dashboard", company: "BrightFlow", owner: "David", amount: "$24K", stage: "Won" },
  { title: "Quarterly board report", company: "PulsePilot", owner: "Omar", amount: "$13K", stage: "Won" },
];

const dealStages = ["New", "Discovery", "Proposal", "Negotiation", "Won"];

function formatId(document) {
  const item = document.toObject ? document.toObject() : document;
  const { _id, __v, ...rest } = item;

  return {
    ...rest,
    id: _id.toString(),
  };
}

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

async function seedLeadsIfEmpty() {
  const count = await Lead.estimatedDocumentCount();

  if (count === 0) {
    await Lead.insertMany(defaultLeads);
  }
}

async function seedDealsIfEmpty() {
  const count = await Deal.estimatedDocumentCount();

  if (count === 0) {
    await Deal.insertMany(defaultDeals);
  }
}

export async function listLeads() {
  await seedLeadsIfEmpty();
  const leads = await Lead.find().sort({ createdAt: -1, _id: -1 });
  return leads.map(formatId);
}

export async function createLead(payload) {
  const { name, company, email, score, source, status } = payload;

  if (!name || !company || !email || !score || !source || !status) {
    throw validationError("Lead name, company, email, score, source, and status are required.");
  }

  const lead = await Lead.create({
    name: name.trim(),
    company: company.trim(),
    email: email.trim().toLowerCase(),
    score: Number(score),
    source,
    status,
  });

  return formatId(lead);
}

export async function listDeals() {
  await seedDealsIfEmpty();
  const deals = await Deal.find().sort({ createdAt: -1, _id: -1 });
  return dealStages.map((stage) => {
    const stageDeals = deals
      .filter((deal) => deal.stage === stage)
      .map(formatId);
    const stageValue = stageDeals.reduce((total, deal) => {
      const amount = Number(String(deal.amount).replace(/[^0-9.]/g, ""));
      return total + (Number.isFinite(amount) ? amount : 0);
    }, 0);

    return {
      stage,
      value: `$${stageValue}K`,
      deals: stageDeals,
    };
  });
}

export async function createDeal(payload) {
  const { title, company, owner, amount, stage } = payload;

  if (!title || !company || !owner || !amount || !stage) {
    throw validationError("Deal title, company, owner, amount, and stage are required.");
  }

  const deal = await Deal.create({
    title: title.trim(),
    company: company.trim(),
    owner: owner.trim(),
    amount: String(amount).startsWith("$") ? String(amount).trim() : `$${String(amount).trim()}`,
    stage,
  });

  return formatId(deal);
}
