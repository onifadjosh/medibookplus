async function test() {
    console.log("Testing Hospital Registration...");
    const hosp = await fetch('https://medium-backend-md5a.onrender.com/api/hospitals/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            hospitalName: "Test Hospital " + Date.now(),
            contactEmail: "test" + Date.now() + "@test.com",
            contactPhone: "08000000000",
            state: "TestState",
            city: "TestCity",
            address: "Test Address",
            adminFirstName: "TestFirst",
            adminLastName: "TestLast",
            adminEmail: "admin" + Date.now() + "@test.com",
            adminPassword: "Password@123",
            adminPhone: "08011111111"
        })
    });
    console.log(await hosp.json());
}
test();
