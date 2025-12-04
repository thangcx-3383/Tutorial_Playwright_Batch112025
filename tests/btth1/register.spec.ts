import { test, expect, Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { Gender, Hobby } from "../enums/btth1.enum";
import {
  GENDER,
  HOBBIES,
  INTERESTS,
  COUNTRIES,
  UserDataType,
} from "../types/btth1.type";

const BASE_URL =
  "https://material.playwrightvn.com/01-xpath-register-page.html";

const fillData = async (page: Page, userData: UserDataType) => {
  if (userData.username) {
    await page.fill('input[id="username"]', userData.username);
  }
  if (userData.email) {
    await page.fill('input[id="email"]', userData.email);
  }
  if (userData.gender) {
    await page.check(`input[name="gender"][value="${userData.gender}"]`);
  }
  if (userData.hobbies) {
    for (const hobby of userData.hobbies) {
      await page.check(`input[name="hobbies"][value="${hobby}"]`);
    }
  }
  if (userData.interests) {
    await page.selectOption('select[id="interests"]', userData.interests);
  }
  if (userData.country) {
    await page.selectOption('select[id="country"]', userData.country);
  }
  if (userData.dateOfBirth) {
    await page.fill('input[id="dob"]', userData.dateOfBirth);
  }
};

const generateUserData = (): UserDataType => {
  const pastDate = faker.date.past();
  const year = pastDate.getFullYear();
  const month = String(pastDate.getMonth() + 1).padStart(2, "0");
  const day = String(pastDate.getDate()).padStart(2, "0");

  return {
    username: faker.person.firstName(),
    email: faker.internet.email(),
    gender: faker.helpers.arrayElement(GENDER),
    hobbies: faker.helpers.arrayElements(HOBBIES, {
      min: 1,
      max: 3,
    }),
    interests: faker.helpers.arrayElement(INTERESTS),
    country: faker.helpers.arrayElement(COUNTRIES),
    dateOfBirth: `${year}-${month}-${day}`,
  };
};

test.beforeEach(async ({ page }) => {
  await page.goto(BASE_URL);
});

test("check gender male to be checked", async ({ page }) => {
  await fillData(page, {
    gender: Gender.MALE,
  });

  await expect(
    page.locator(`input[name="gender"][value="${Gender.MALE}"]`)
  ).toBeChecked();
});

test("check gender female to be checked", async ({ page }) => {
  await fillData(page, {
    gender: Gender.FEMALE,
  });

  await expect(
    page.locator(`input[name="gender"][value="${Gender.FEMALE}"]`)
  ).toBeChecked();
});

test("check one hobbies to be checked", async ({ page }) => {
  await fillData(page, {
    hobbies: [Hobby.READING],
  });

  await expect(
    page.locator(`input[name="hobbies"][value="${Hobby.READING}"]`)
  ).toBeChecked();
});

test("check two hobbies to be checked", async ({ page }) => {
  await fillData(page, {
    hobbies: [Hobby.READING, Hobby.TRAVELING],
  });

  await expect(
    page.locator(`input[name="hobbies"][value="${Hobby.READING}"]`)
  ).toBeChecked();
  await expect(
    page.locator(`input[name="hobbies"][value="${Hobby.TRAVELING}"]`)
  ).toBeChecked();
});

test("check three hobbies to be checked", async ({ page }) => {
  await fillData(page, {
    hobbies: [Hobby.READING, Hobby.TRAVELING, Hobby.COOKING],
  });

  await expect(
    page.locator(`input[name="hobbies"][value="${Hobby.READING}"]`)
  ).toBeChecked();
  await expect(
    page.locator(`input[name="hobbies"][value="${Hobby.TRAVELING}"]`)
  ).toBeChecked();
  await expect(
    page.locator(`input[name="hobbies"][value="${Hobby.COOKING}"]`)
  ).toBeChecked();
});

test("register with random data", async ({ page }) => {
  const userData = generateUserData();
  console.log(userData);

  await fillData(page, userData);
  await page.click('button[type="submit"]');

  if (userData.username && userData.email) {
    const row = page.locator(
      `#userTable tr:has(td:text-is("${userData.username}")):has(td:text-is("${userData.email}"))`
    );
    await expect(row).toBeVisible();

    const detailsCell = row.locator("td").nth(3);
    if (userData.gender) {
      await expect(detailsCell).toContainText(`Gender: ${userData.gender}`);
    }
    if (userData.hobbies && userData.hobbies.length > 0) {
      const sortedHobbies = [...userData.hobbies].sort((a, b) => {
        return HOBBIES.indexOf(a) - HOBBIES.indexOf(b);
      });
      const hobbiesText = sortedHobbies.join(", ");
      await expect(detailsCell).toContainText(`Hobbies: ${hobbiesText}`);
    }
    if (userData.country) {
      await expect(detailsCell).toContainText(`Country: ${userData.country}`);
    }
    if (userData.dateOfBirth) {
      await expect(detailsCell).toContainText(
        `Date of Birth: ${userData.dateOfBirth}`
      );
    }
  }
});
