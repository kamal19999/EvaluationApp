import { Client, Account, Databases, ID, Query } from "appwrite";

const client = new Client()
    .setEndpoint("https://nyc.cloud.appwrite.io/v1")
    .setProject("698522f800092c5d8539");

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases, ID, Query };