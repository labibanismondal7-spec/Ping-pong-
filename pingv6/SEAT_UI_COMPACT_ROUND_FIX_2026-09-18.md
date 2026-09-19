# Compact Round Room Seat Fix — 2026-09-18

- Empty room seats no longer render the `＋` character.
- Added `public/images/icons/seat-mic-empty.png`, derived from the supplied microphone artwork with the white background made transparent so it blends with the room theme.
- Shipped room seat diameter is now 56px by default.
- Shipped frame scale is now 1.00x by default.
- Persisted `data/room_ui_config.json` is set to 56px / 1.00x so a stale shipped 68px / 1.24x configuration cannot restore the old sizing on first boot.
- Occupied profile photos remain perfectly circular and fill the seat circle exactly.
- Custom seat frames now use the exact same 56px footprint as the avatar; they no longer use the previous 136% oversized overlay.
- Grid geometry is fixed at four columns for the 12-seat room, with compact gaps. Visual effects are kept outside layout and cannot resize the seat.
- Existing seat click/take-seat, profile sheet, mic/voice, VIP, badges, names, gifts, games, and relationship-link behavior is preserved.
