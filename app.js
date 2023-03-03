import { startHvdb } from "./hvdb.js";
import account from "./account/account.json" assert { type: "json" };

startHvdb(
  { username: account.username, password: account.password },
  { pageNum: 1, pageSize: 15 }
);
