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

  // 6. Test Build Output or Page Structure
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
