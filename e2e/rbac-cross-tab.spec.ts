import { test, expect } from '@playwright/test';

test('superadmin toggles RBAC → affected admin auto-refreshes and receives toast', async ({ browser }) => {
  // Setup two pages (superadmin dashboard + admin dashboard)
  const context = await browser.newContext();
  const superPage = await context.newPage();
  const adminPage = await context.newPage();

  // Mock data
  const adminsList = [
    { id: 1, username: 'superadmin', email: 'super@local', is_superuser: true, avatar_url: null, can_manage_users: true, can_manage_content: true, can_approve_admissions: true },
    { id: 2, username: 'alice', email: 'alice@local', is_superuser: false, avatar_url: null, can_manage_users: false, can_manage_content: false, can_approve_admissions: false },
  ];

  const usersList = [
    { id: 3, username: 'bob', email: 'bob@local', first_name: 'Bob', last_name: 'Builder', is_staff: false }
  ];

  // admin /users/me initial (alice without can_manage_users)
  let currentUserCallCount = 0;
  await adminPage.route('**/users/me/**', async (route) => {
    currentUserCallCount += 1;
    const body = {
      id: 2,
      username: 'alice',
      email: 'alice@local',
      first_name: 'Alice',
      last_name: 'Wonder',
      is_staff: true,
      is_superuser: false,
      // first call: no permission; subsequent calls (after RBAC change) -> granted
      can_manage_users: currentUserCallCount > 1,
    };
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });

  // admin /users list
  await adminPage.route('**/users/**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(usersList) });
  });

  // superadmin: list admins
  await superPage.route('**/manager/rbac/list_admins/**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(adminsList) });
  });

  // superadmin: capture the PATCH that updates alice (id:2)
  await superPage.route('**/manager/rbac/2/update_permissions/**', async (route) => {
    // return updated user (alice) with can_manage_users=true
    const updated = {
      id: 2,
      username: 'alice',
      email: 'alice@local',
      first_name: 'Alice',
      last_name: 'Wonder',
      is_staff: true,
      is_superuser: false,
      can_manage_users: true,
      can_manage_content: false,
      can_approve_admissions: false,
    };
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok', user: updated }) });
  });

  // 1) Open admin/users (page that will display Protected initially)
  await adminPage.goto('/admin/users');
  await expect(adminPage.locator('text=Protected')).toBeVisible();

  // 2) Open superadmin RBAC page and toggle 'Manage Users' for alice
  await superPage.goto('/admin/rbac');
  // ensure table row is visible
  const aliceRow = superPage.locator('tr', { hasText: 'alice' });
  await expect(aliceRow).toBeVisible();

  const manageUsersCell = aliceRow.locator('td').nth(3); // 0=user,1=content,2=admissions,3=manage users
  const toggleBtn = manageUsersCell.locator('button');
  await toggleBtn.click();

  // superadmin should see a success toast
  await expect(superPage.locator('text=Permissions updated')).toBeVisible();

  // admin page should receive storage event and refresh current user → show toast
  await expect(adminPage.locator('text=Permissions updated')).toBeVisible({ timeout: 5000 });

  // and the Protected badge should be replaced by actionable controls (Edit button)
  await expect(adminPage.locator('text=Protected')).toHaveCount(0);
  await expect(adminPage.locator('button[title="Edit"]')).toBeVisible();

  await context.close();
});