import React, { useState, useEffect } from 'react';
import Codemirror from 'codemirror';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
require('codemirror/mode/javascript/javascript');
import '../public/codemirror.css';
import '../../../node_modules/codemirror/lib/codemirror.css';
import '../../../node_modules/codemirror/theme/dracula.css';
import DownloadBtn from './DownloadBtn'
const _ = require('lodash');
const MongoSchemaIDE = ({schemaData, selectedSchemaData, graphQLSchema}) => {
  const [data, setData] = useState([]);
  const [graphData, setGraphData] = useState({});
  // iterates over the graphQLSchema and removes the double quotes
  const eliminateQuotes = (obj) => {
    let str = '';
    for (let key in obj) {
      str += obj[key].replace(/["]+/g, '');
    }
    return str;
  }
  // function creates a new line to format the schemas
  const newLinePillar = (str) => {
    if (str === undefined) return;
    let newStr = '';
    let array = str.split('');
    for (let i = 0; i < array.length; i+=1) {
      if (array[i] === '|') {
        array[i] = '\n';
        newStr += array[i];
      } else if (array[i] === '{' && array[i - 1] === '{') {
        continue;
      } else {
        newStr += array[i];
      }
    }
    return newStr;
  }
  // adds a new line where there is a comma
  const newLineComma = (str) => {
    let newStr = '';
    let array = str.split('');
    for (let i = 0; i < array.length; i+=1) {
      if (array[i] === ',') {
        newStr += array[i];
        newStr += '\n        ';
      } else {
        newStr += array[i];
      }
    }
    return newStr;
  }
  // mongoDB Schema
  const noQuotes = eliminateQuotes(JSON.stringify(selectedSchemaData));
  const format = newLineComma(noQuotes);
  // const mSchema = newLineComma(graphQLSchema.mongoSchema);
  const newLineMongo = newLinePillar(graphQLSchema.mongoSchema);
  const mongoSchemaWithoutQuotes = eliminateQuotes(newLineMongo);
  const formattedMongo = newLineComma(mongoSchemaWithoutQuotes);
  // graphQL Schema
  const newTypes = eliminateQuotes(graphQLSchema.types);
  const newQueries = eliminateQuotes(graphQLSchema.queries);
  const commaLessMutation = eliminateQuotes(graphQLSchema.mutation);
  const rootQ = newLinePillar(newQueries);
  const formattedTypes = newLinePillar(newTypes);
  const rootM = newLinePillar(commaLessMutation);
  const combineQueries = (query1, query2, query3) => {
    return query1 + query2 + query3;
  }
  const combined = combineQueries(formattedTypes, rootQ, rootM);
  return(
    <div className="codeboxContainer">
      <Tabs>
      <TabList>
        <Tab>GraphQL Schemas</Tab>
        <Tab>MongoDB Schemas</Tab>
      </TabList>
      <TabPanel>
        <div className="codebox2">
          <CodeMirror
            value={_.isEmpty(graphQLSchema) ? `/*
*** Input MongoDB Uri ***
*** Press Enter ***
*** Click Add Selected Schemas ***
*** View GraphQL Schemas Here ***
*/` : combined}
            options={{
              mode: 'javascript',
              lineWrapping: true,
              theme: 'dracula',
              lineNumbers: true,
              cursorScrollMargin: 48,
              indentUnit: 2,
              tabSize: 2,
              styleActiveLine: true,
              smartIndent: true,
            }}
            />
        </div>
      </TabPanel>
      <TabPanel>
        <div className="codebox">
          <CodeMirror
          value={_.isEmpty(selectedSchemaData[0]) ? `/*
*** MongoDB Schemas will be displayed here ***
*/` : formattedMongo}
          options={{
            mode: 'javascript',
            lineWrapping: true,
            theme: 'dracula',
            lineNumbers: true,
            cursorScrollMargin: 48,
            indentUnit: 2,
            tabSize: 2,
            styleActiveLine: true,
            smartIndent: true,

          }}
          />
        </div>
      </TabPanel>
      </Tabs>
      <DownloadBtn graphSchema={combined}/>
    </div>
  )
}
export default MongoSchemaIDE;{/*  */}