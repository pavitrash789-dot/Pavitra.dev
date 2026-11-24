import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

console.log("=========================================");
console.log("🚀 STARTING AUTOMATED TEST SUITE");
console.log("=========================================\n");

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    const res = fn();
    if (res instanceof Promise) {
      await res;
    }
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error("   Error:", err.message);
    failed++;
  }
}

async function runAll() {
  // 1. Test Site Constants & Categories
  await test("Site constants: basic info and social links are present", async () => {
    const { site, stack, services, categories, allFeatures, designs, steps } = await import(
      "../src/lib/site.ts"
    );
    assert.ok(site.name, "site.name should exist");
    assert.ok(site.email.includes("@"), "site.email should be valid");
    assert.ok(site.wa.startsWith("https://wa.me/"), "site.wa should be WhatsApp URL");
    assert.ok(stack.length >= 5, "stack should have technologies");
    assert.ok(services.length >= 8, "services should have at least 8 items");
    assert.ok(categories.length >= 10, "categories should have at least 10 items");
    assert.ok(allFeatures.length >= 10, "allFeatures should have at least 10 items");
    assert.ok(designs.length >= 5, "designs should have at least 5 styles");
    assert.strictEqual(steps.length, 7, "steps should have 7 steps");
  });

  await test("Category integrity: every category has name, desc, icon, and valid features", async () => {
    const { categories, allFeatures } = await import("../src/lib/site.ts");
    const featureSet = new Set(allFeatures);
    for (const c of categories) {
      assert.ok(c.id, "Category should have an id");
      assert.ok(c.name, `Category ${c.id} should have a name`);
      assert.ok(c.desc, `Category ${c.id} should have a description`);
      assert.ok(c.icon, `Category ${c.id} should have an icon`);
      assert.ok(Array.isArray(c.ex) && c.ex.length > 0, `Category ${c.id} should have examples`);
      assert.ok(Array.isArray(c.feat), `Category ${c.id} should have features list`);
      for (const f of c.feat) {
        assert.ok(featureSet.has(f), `Category ${c.id} feature "${f}" must exist in allFeatures`);
      }
    }
  });

  // 2. Test Contact API Route Handler Validation
  await test("Contact API handler: rejects empty or invalid body with 400", async () => {
    const { POST } = await import("../src/app/api/contact/route.ts");

    // Empty body
    const reqEmpty = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const resEmpty = await POST(reqEmpty);
    assert.strictEqual(resEmpty.status, 400, "Should return 400 for empty body");
    const dataEmpty = await resEmpty.json();
    assert.ok(dataEmpty.error, "Should have error message");

    // Invalid email
    const reqBadEmail = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Alice", email: "not-an-email", message: "Hello world this is a test" }),
    });
    const resBadEmail = await POST(reqBadEmail);
    assert.strictEqual(resBadEmail.status, 400, "Should return 400 for invalid email");

    // Short message (< 10 chars)
    const reqShortMsg = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Alice", email: "alice@example.com", message: "Hi" }),
    });
    const resShortMsg = await POST(reqShortMsg);
    assert.strictEqual(resShortMsg.status, 400, "Should return 400 for short message");
  });

  // 3. Test Submit API Route Handler Validation
  await test("Submit API handler: rejects invalid payload with 400", async () => {
    const { POST } = await import("../src/app/api/submit/route.ts");

    // Missing data parameter
    const fdEmpty = new FormData();
    const reqEmpty = new Request("http://localhost/api/submit", {
      method: "POST",
      body: fdEmpty,
    });
    const resEmpty = await POST(reqEmpty);
    assert.strictEqual(resEmpty.status, 400, "Should return 400 when form data is empty");

    // Missing required fields (short purpose, missing email, missing name)
    const fdInvalid = new FormData();
    fdInvalid.append(
      "data",
      JSON.stringify({
        name: "",
        email: "invalid-email",
        category: "ecommerce",
        purpose: "short",
      })
    );
    const reqInvalid = new Request("http://localhost/api/submit", {
      method: "POST",
      body: fdInvalid,
    });
    const resInvalid = await POST(reqInvalid);
    assert.strictEqual(resInvalid.status, 400, "Should return 400 for missing required fields");
    const jsonInvalid = await resInvalid.json();
    assert.ok(jsonInvalid.error.includes("required fields"), "Error message should mention required fields");
  });

  // 4. Test 3D Components file structure and exports
  await test("3D components: all component files exist and are readable", () => {
    const files = [
      "src/components/3d/Hero3DCanvas.tsx",
      "src/components/3d/Tilt3D.tsx",
      "src/components/3d/Mockup3D.tsx",
      "src/components/3d/BackgroundMesh3D.tsx",
    ];

    for (const f of files) {
      const fullPath = path.resolve(process.cwd(), f);
      assert.ok(fs.existsSync(fullPath), `File ${f} should exist`);
      const content = fs.readFileSync(fullPath, "utf-8");
      assert.ok(content.includes('"use client"'), `File ${f} should have "use client" directive`);
      assert.ok(content.includes("export default"), `File ${f} should have a default export`);
    }
  });

  // 5. Test Database schema matches API and Admin
  await test("Database Schema: contains required tables and columns", () => {
    const schemaPath = path.resolve(process.cwd(), "supabase/schema.sql");
    assert.ok(fs.existsSync(schemaPath), "supabase/schema.sql should exist");
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");

    // Check tables
    assert.ok(schemaSql.includes("create table requests"), "Should create requests table");
    assert.ok(schemaSql.includes("create table enquiries"), "Should create enquiries table");
    assert.ok(schemaSql.includes("create table portfolio_projects"), "Should create portfolio_projects table");

    // Check requests columns
    const expectedCols = [
      "category",
      "purpose",
      "design",
      "pages",
      "features",
      "name",
      "business",
      "email",
      "whatsapp",
      "description",
      "reference_url",
      "budget",
      "timeline",
      "files",
      "notes",
      "status",
    ];
    for (const col of expectedCols) {
      assert.ok(schemaSql.includes(col), `schema.sql should define column "${col}"`);
    }
  });

  // 6. Test Pricing & Quotation System
  await test("Pricing System: exact starting prices for all 17 categories", async () => {
    const { DEFAULT_CATEGORY_PRICING } = await import("../src/lib/pricing.ts");
    const { categories } = await import("../src/lib/site.ts");

    const expectedPrices = {
      landing: 2999,
      portfolio: 3999,
      personal_brand: 4999,
      business: 5999,
      cms: 7999,
      restaurant: 4999,
      gym: 4999,
      blog: 5999,
      agency: 6999,
      education: 7999,
      realestate: 9999,
      hotel: 9999,
      event: 5999,
      booking: 7999,
      ecommerce: 11999,
      saas: 14999,
      custom: 19999,
    };

    assert.strictEqual(DEFAULT_CATEGORY_PRICING.length, 17, "Should have exactly 17 categories");
    for (const [id, expectedPrice] of Object.entries(expectedPrices)) {
      const match = DEFAULT_CATEGORY_PRICING.find(c => c.id === id);
      assert.ok(match, `Category ${id} should exist in DEFAULT_CATEGORY_PRICING`);
      assert.strictEqual(match.startingPrice, expectedPrice, `${id} starting price must match ${expectedPrice}`);

      const siteMatch = categories.find(c => c.id === id);
      assert.ok(siteMatch, `Category ${id} should exist in site.ts categories`);
      assert.strictEqual(siteMatch.startingPrice, expectedPrice, `${id} starting price in site.ts must match ${expectedPrice}`);
    }
  });

  await test("Package System & Dynamic Calculator: calculates accurately", async () => {
    const { calculatePricingBreakdown, PACKAGES, formatINR } = await import("../src/lib/pricing.ts");

    assert.strictEqual(PACKAGES.length, 3, "Should have Starter, Professional, Premium packages");
    assert.strictEqual(PACKAGES[0].maxPages, 3, "Starter should include 3 pages");
    assert.strictEqual(PACKAGES[1].maxPages, 7, "Professional should include 7 pages");
    assert.strictEqual(PACKAGES[2].maxPages, 12, "Premium should include 12 pages");

    // Test Landing Page Starter with 3 pages (no extra)
    const b1 = calculatePricingBreakdown({
      categoryId: "landing",
      packageId: "starter",
      pages: 3,
      selectedFeatureIds: [],
      selectedRequirementIds: [],
    });
    assert.strictEqual(b1.startingPrice, 2999);
    assert.strictEqual(b1.selectedPackagePrice, 2999);
    assert.strictEqual(b1.extraPages, 0);
    assert.strictEqual(b1.extraPagesCost, 0);
    assert.strictEqual(b1.estimatedTotal, 2999);

    // Test E-commerce Professional with 10 pages (+3 extra pages @ ₹500 = ₹1,500) and Payment Gateway (₹2,499)
    const b2 = calculatePricingBreakdown({
      categoryId: "ecommerce",
      packageId: "professional",
      pages: 10,
      selectedFeatureIds: ["payment_gateway"],
      selectedRequirementIds: [],
    });
    assert.strictEqual(b2.startingPrice, 11999);
    assert.strictEqual(b2.selectedPackagePrice, 18999);
    assert.strictEqual(b2.extraPages, 3);
    assert.strictEqual(b2.extraPagesCost, 1500);
    assert.strictEqual(b2.featuresCost, 2499);
    assert.strictEqual(b2.estimatedTotal, 18999 + 1500 + 2499);

    // INR formatter
    assert.strictEqual(formatINR(2999), "₹2,999");
    assert.strictEqual(formatINR(14999), "₹14,999");
  });

  await test("Pricing API: GET returns valid configuration", async () => {
    const { GET } = await import("../src/app/api/pricing/route.ts");
    const res = await GET();
    assert.strictEqual(res.status, 200, "GET /api/pricing should return 200");
    const config = await res.json();
    assert.ok(Array.isArray(config.categories), "Config should have categories array");
    assert.strictEqual(config.categories.length, 17, "Config should have 17 categories");
  });

  await test("Portfolio: includes live website my-portfolio-beta-ochre-netty7ie4y.vercel.app", async () => {
    const sectionsCode = fs.readFileSync(path.resolve(process.cwd(), "src/components/Sections.tsx"), "utf8");
    assert.ok(
      sectionsCode.includes("my-portfolio-beta-ochre-netty7ie4y.vercel.app"),
      "Sections.tsx must include demo_url for my-portfolio-beta-ochre-netty7ie4y.vercel.app"
    );
  });

  // 7. Test Build Output or Page Structure
  await test("Production Build: page and essential sections exist", () => {
    const htmlPath = path.resolve(process.cwd(), ".next/server/app/index.html");
    if (fs.existsSync(htmlPath)) {
      const html = fs.readFileSync(htmlPath, "utf-8");
      assert.ok(html.includes("Pavitra"), "HTML should contain author name");
      assert.ok(html.includes("Create Your Idea of a Website"), "HTML should contain main headline");
      assert.ok(html.includes("Choose your"), "HTML should contain Choose section");
      assert.ok(html.includes("Customize your"), "HTML should contain Customize section");
      assert.ok(html.includes("How It") && html.includes("Works"), "HTML should contain Process section");
    } else {
      const pagePath = path.resolve(process.cwd(), "src/app/page.tsx");
      assert.ok(fs.existsSync(pagePath), "src/app/page.tsx should exist");
    }
  });

  console.log("\n=========================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("=========================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runAll();
