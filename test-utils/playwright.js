export async function loginUser(page) {
	await page.goto("http://localhost:3000");
	await page.getByRole("link", { name: "Login" }).click();
	await page.getByRole("textbox", { name: "Enter Your Email" }).fill("test@gmail.com");
	await page.getByRole("textbox", { name: "Enter Your Password" }).fill("test@gmail.com");
	await page.getByRole("button", { name: "LOGIN" }).click();
}

export async function loginAdmin(page) {
	await page.goto("http://localhost:3000");
	await page.getByRole("link", { name: "Login" }).click();
	await page.getByRole("textbox", { name: "Enter Your Email" }).fill("cs4218@test.com");
	await page.getByRole("textbox", { name: "Enter Your Password" }).fill("cs4218@test.com");
	await page.getByRole("button", { name: "LOGIN" }).click();
}
