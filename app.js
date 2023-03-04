import { startHvdb } from "./hvdb.js";
import account from "./account/account.json" assert { type: "json" };

startHvdb(
  { username: account.username, password: account.password },
  // pageNum: Navigate page, pageSize: Show works per page
  { pageNum: 1, pageSize: 10 }
);
