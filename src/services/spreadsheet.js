const { google } = require("googleapis");
const camelCase = require("camelcase");
const { oauth2Client } = require("./google");

const sheets = new google.sheets({ version: "v4", auth: oauth2Client });

exports.extractIdFromURI = (uri) => {
  const regex = new RegExp(
    "https://docs.google.com/spreadsheets/d/(.*)/edit.*"
  );

  const match = regex.exec(uri);

  if (!match || match.length < 2) {
    return null;
  }

  return match[1];
};

exports.getWorksheetContent = async (spreadsheet, worksheet) => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheet,
    range: `${worksheet}!A1:ZZZ`,
    valueRenderOption: "UNFORMATTED_VALUE",
  });
  return res.data.values;
};

exports.getSpreadsheetTabs = async (spreadsheet) => {
  const response = await sheets.spreadsheets.get({
    spreadsheetId: spreadsheet,
  });
  const tabs = response.data.sheets;
  const tabsList = tabs.map(({ properties }) => ({
    name: properties.title,
    slug: camelCase(properties.title),
    index: properties.index,
    sheetId: properties.sheetId,
  }));

  return tabsList;
};