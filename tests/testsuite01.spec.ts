import { test, expect } from "@playwright/test";
//import { faker } from '@faker-js/faker';
import { LoginPage } from "./pages/login-page";
import { DashboardPage } from "./pages/dashboard-page";
import { CreateRoomPage } from "./pages/createRoom-page";
import { CreateNewClientPage } from "./pages/CreateNewClient-page";
import { CreateBillsPage } from "./pages/createBills-page";
import { CreateReservationsPage } from "./pages/createReservations-page";
import { EditClientPage } from "./pages/editClient-page";
import { EditBillPage } from "./pages/editBill-page";
import { DeleteReservationsPage } from "./pages/deleteReservations-page";
import { EditRoomPage } from "./pages/editRoom-page";
import { EditReservationPage } from "./pages/editReservation-page";

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.performLogin(
    `${process.env.TEST_USERNAME}`,
    `${process.env.TEST_PASSWORD}`
  );

  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

});

test.afterEach(async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.performLogout()

  //await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

  await page.waitForTimeout(5000);

});


test.describe("Test suite 01", () => {

  test("TC 01A", async ({ page }) => {

    const dashboardPage = new DashboardPage(page);

    await dashboardPage.performLogout()
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.performLogin(
      `${process.env.TEST_USERNAME}`,
      `${process.env.TEST_PASSWORD}`
    );

    await expect(
      page.getByRole("heading", { name: "Tester Hotel Overview" })
    ).toBeVisible();
    await page.waitForTimeout(5000);

  });

  test("TC 02-create room", async ({ page }) => {

    const createRoomPage = new CreateRoomPage(page);
    const dashboardPage = new DashboardPage(page)
    //Enter to room page
    await dashboardPage.gotoRoom();
    await expect(page.getByText('Rooms')).toBeVisible()
    //Enter to Create room Form
    await createRoomPage.goToCreateRoom();
    await expect(page.getByText('New Room')).toBeVisible();

    // Fill out the form to create a new room
    const category = await createRoomPage.selectCategory.inputValue();
    const roomNumber = await createRoomPage.selectNumber.inputValue();
    const floor = await createRoomPage.selectFloor.inputValue();
    const price = await createRoomPage.selectPrice.inputValue();
    const features = await createRoomPage.selectFeatures.inputValue();

    //Create a new room
    await createRoomPage.fillOutCreateRoomsForm();

    // Get the last created room element
    const lastRoomElement = page.locator("#app > div > div.rooms > div:nth-last-child(1)");

    // Assertions 
    await expect(lastRoomElement).toContainText(category);
    await expect(lastRoomElement).toContainText(roomNumber);
    await expect(lastRoomElement).toContainText(floor);
    await expect(lastRoomElement).toContainText('Available');
    await expect(lastRoomElement).toContainText(price);
    await expect(lastRoomElement).toContainText(features);

    await page.waitForTimeout(5000);
  });


  test("TC 03-create new client", async ({ page }) => {

    const createNewClientPage = new CreateNewClientPage(page)
    const dashboardPage = new DashboardPage(page)

    await dashboardPage.gotoClient()
    await createNewClientPage.createNewClientForm()
    const element = page.locator(
      "#app > div > div.clients > div:nth-last-child(1)"
    );
    // Assertions 
    await expect(element).toContainText(createNewClientPage.fullName);
    await expect(element).toContainText(createNewClientPage.userEmail);
    await expect(element).toContainText(createNewClientPage.userPhoneNo);
    await page.waitForTimeout(5000);

  });

  test("TC 04-create new bills", async ({ page }) => {

    const createBillsPage = new CreateBillsPage(page)
    //go to Create bill page
    await createBillsPage.goToViewBills()
    await expect(page.getByText('Bills')).toBeVisible;
    //Create bill page-navigate
    await createBillsPage.goToCreateBills()
    await expect(page.getByText('New Bill')).toBeVisible();


    const filledValue = await createBillsPage.fillNewBillForm();
    const element = page.locator("#app > div > div.bills > div:nth-last-child(1)");

    // Assertions 
    await expect(element).toContainText("ID");
    await expect(element).toContainText(filledValue);

  });

  test("TC 05-create new reservation", async ({ page }) => {

    const createReservationPage = new CreateReservationsPage(page)
    //go to Create bill page
    await createReservationPage.goToViewReservation()
    await expect(page.getByText('Reservations')).toBeVisible();

    await createReservationPage.goToCreateReservation()
    await expect(page.getByText('New Reservation')).toBeVisible();

    const { startDate, endDate } = await createReservationPage.fillNewReservationForm();
    const element = page.locator('#app > div > div.reservations > div:nth-last-child(1)');

    // Assersions
    //I am commeting this assertion because after I run the EditReservationTest the data get changed
    // await expect(element).toContainText('Jonas Hellman');
    //await expect(element).toContainText('Client: 1');
    await expect(element).toContainText('Room: 1');
    await expect(element).toContainText('Bill: 1');
    await expect(element).toContainText(startDate);
    await expect(element).toContainText(endDate);
    await element.waitFor({ state: 'visible' });

  });

  test("TC 06-edit Room", async ({ page }) => {

    const editRoomPage = new EditRoomPage(page)
    await editRoomPage.goToViewRooms()
    await expect(page.getByText('Rooms')).toBeVisible;


    const filledValue = await editRoomPage.editRoomForm();
    const element = page.locator(
      "#app > div > div.rooms > div:nth-child(1) > div:nth-child(2) > div.price"
    );
    await expect(element).toContainText(filledValue);

  });

  test("TC 07-edit client", async ({ page }) => {

    const editClientPage = new EditClientPage(page)

    await editClientPage.editClientForm()
    const element = page.locator(
      "#app > div > div.clients > div:nth-child(1)"
    );
    // Assertions 
    await expect(element).toContainText(editClientPage.userEmail);
    await expect(element).toContainText(editClientPage.userPhoneNo);


  });

  test("TC 08-edit bill", async ({ page }) => {

    const editBillPage = new EditBillPage(page)
    await editBillPage.goToViewBills()
    await expect(page.getByText('Bills')).toBeVisible;

    const filledValue = await editBillPage.editBillForm();
    const element = page.locator(
      "#app > div > div.bills > div:nth-child(1)"
    );
    await expect(element).toContainText(filledValue);


  });
  test("TC 09-edit Reservation", async ({ page }) => {

    const editReservationPage = new EditReservationPage(page)
    await editReservationPage.goToViewReservations()
    await expect(page.getByText('Reservations')).toBeVisible;

    await editReservationPage.editReservationForm();
    const element = page.locator(
      "#app > div > div.reservations > div:last-child > div.room"
    );
    await expect(element).toContainText('Room: 2');

  });
  test("TC 10-delete reservation", async ({ page }) => {

    const deleteReservationsPage = new DeleteReservationsPage(page)
    await deleteReservationsPage.goToViewReservation();

    //Count the reservations before deletion
    const reservationsBefore = await page.locator('.reservation').count();
    await deleteReservationsPage.DeleteReservationForm();

    //Count the reservations after deletion
    const reservationsAfter = await page.locator('.reservation').count();

    //assertion that the count decreased by 1
    expect(reservationsAfter).toBe(reservationsBefore - 1);

  });
});