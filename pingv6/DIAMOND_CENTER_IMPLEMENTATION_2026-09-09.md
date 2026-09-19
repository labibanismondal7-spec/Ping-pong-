# Diamond Center — Production Implementation (2026-09-09)

## What was added
- Admin Panel → **Diamond Center**
- Admin can create a Diamond Center against an existing User ID.
- Assigned user sees **Diamond Center** in the app profile menu.
- Center inventory is funded with Diamonds by an authorized Admin.
- Seller selects an INR recharge package and enters the target User ID.
- Server calculates optional Center bonus (0–20%), checks Center inventory, then credits the target user's **Diamonds only**.
- Every recharge records: Center User ID, target User ID, INR amount, base Diamonds, bonus %, bonus Diamonds, total Diamonds and timestamp.
- Center history and running balance are visible to the seller.
- Admin can enable/disable a Center, change bonus %, add recharge packages and top up Center Diamonds.
- Default package on creation: **₹300 → 100,000 Diamonds**.
- No Coins are created, deducted, credited, or used anywhere in the Diamond Center module.

## Example
Center bonus = 6%.
Package = ₹300 → 100,000 Diamonds.
Target receives:
- Base: 100,000 💎
- Bonus: 6,000 💎
- Total: 106,000 💎
- Center inventory decreases by 106,000 💎

## Security
- User endpoints require the existing verified user session.
- Seller identity comes from the authenticated session, not a client-supplied seller ID.
- Admin operations use existing RBAC permissions:
  - `diamond-center:view`
  - `diamond-center:manage`
  - `diamond-center:topup`
- Target User ID must resolve to an existing user.
- Seller cannot recharge their own account.
- Center inventory cannot go below zero.
- Diamond ceiling checks reuse the project's existing `clampDiamondBalance`.
- Wallet update events are emitted to keep balances live.
- Admin actions are audit logged through the existing RBAC audit logger.

## Data
- `data/diamond_centers.json`
- `data/diamond_center_transactions.json`

These files are created/updated through the existing safeRead/safeWrite persistence layer.

## Verification
- New `test/diamondCenter.test.js` covers creation, default package, Center top-up, 6% bonus delivery, inventory deduction, Diamond transaction logging, and insufficient-inventory rejection.
- Full repository test suite: **51/51 suites passed**.
