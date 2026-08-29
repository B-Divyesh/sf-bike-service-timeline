# Demo sandbox

Open `/?demo=1` or `/demo` to load Aster Road, Maple Cargo, and Pine
Trail. The sample includes components, date and distance reminders, odometers,
costs, repair shop details, and service entries.

Demo records use the IndexedDB database `demo:bike-service-timeline`. Real
records use `bike-service-timeline`. The app does not read or change saved
license keys while demo mode is open, and it makes no license request.

The persistent banner says **Demo — sample data, nothing is saved**. **Reset
demo** clears only the demo database and restores the shipped sample. **Start
for real** deletes demo changes before opening the real empty state.
