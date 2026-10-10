# Firestore Security Specification

## 1. Data Invariants
- `site_settings/main`: Must always exist, read public, write admin-only.
- `mailboxes/{mailboxId}`: Only accessible by the owner.
- `messages/{messageId}`: Linked to a mailbox. Only accessible by owner of the mailbox.
- `emails/{emailId}`: Linked to a mailbox. Only accessible by owner of the mailbox.
- `admins/{uid}`: Only accessible by admins.

## 2. The "Dirty Dozen" Payloads (Examples)
1. Write to `site_settings/main` as unauthorized user. (Should Fail)
2. Read `mailboxes/staff_1` as unauthorized user. (Should Fail)
3. Write to `mailboxes/staff_1` as unauthorized user. (Should Fail)
4. Update `site_settings/main` as admin. (Should Pass)
5. Read `emails/{id}` as authorized user, but it belongs to another mailbox. (Should Fail)
6. Write to `emails/{id}` as staff. (Should Fail - system writes only)
7. Create a `mailbox` as non-admin. (Should Fail)
8. Update `messages/{id}` for a message in a mailbox I don't own. (Should Fail)
9. Read `admins/{uid}` as non-admin. (Should Fail)
10. Write to `admins/{uid}` as non-admin. (Should Fail)
11. Update `site_settings/main` with `branding: "invalid_type"` (Should Fail - Schema violation)
12. Read a message with a malformed ID. (Should Fail)

## 3. Test Runner
[To be implemented in `firestore.rules.test.ts`]
