import { PostgresConnector, SQLite3Connector } from "https://raw.githubusercontent.com/jerlam06/denodb/master/mod.ts";

export const connector = new PostgresConnector({
	host: 'localhost',
	username: 'hoteladmin',
	password: 'hotelpwd',
	database: 'hotel'
});

// for testing purpose
export const testConnector = new SQLite3Connector({
	filepath: './database-test.sqlite'
})