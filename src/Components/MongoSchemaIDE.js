
import React, { useState, useEffect } from 'react';
import Codemirror from 'codemirror';
import {UnControlled as CodeMirror} from 'react-codemirror2';
require('codemirror/mode/javascript/javascript');
import '../public/codemirror.css';
import '../../node_modules/codemirror/lib/codemirror.css';
import '../../node_modules/codemirror/theme/dracula.css';
const _ = require('lodash');

const MongoSchemaIDE = ({schemaData, selectedSchemaData, graphQLSchema}) => {
  const [data, setData] = useState([]);
  const [graphData, setGraphData] = useState({});

  console.log("UPDATED ROOTQUERY OBJ+++", graphQLSchema)
  // iterates over the graphQLSchema and removes the double quotes
  const eliminateQuotes = (obj) => {
    let str = '';

    for (let key in obj) {
      str += obj[key].replace(/["]+/g, '');
    }
    return str;
  }

  const newLinePillar = (str) => {
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
  const mongoSchemaWithoutQuotes = eliminateQuotes(JSON.stringify(selectedSchemaData));

  // graphQL Schema
  const newTypes = eliminateQuotes(graphQLSchema.types);
  const newQueries = eliminateQuotes(graphQLSchema.queries);
  const commaLessMutation = eliminateQuotes(graphQLSchema.mutation);

  // const typeQ = newLinePillar(newTypes);
  const rootQ = newLinePillar(newQueries);
  const formattedTypes = newLinePillar(newTypes);
  const rootM = newLinePillar(commaLessMutation);

  // const typeOutput = newLineComma(newTypes);
  // const mutationNL = newLineComma(commaLessMutation);

  const combineQueries = (query1, query2, query3) => {
    return query1 + query2 + query3;
  }

  const combined = combineQueries(formattedTypes, rootQ, rootM);

  console.log('ROOTQ =========>', rootQ)
  // const newS =

  return(
    <div className="codeboxContainer">
      <div className="codebox">
        <CodeMirror
        value={_.isEmpty(selectedSchemaData[0]) ? `console.log("hello")` : mongoSchemaWithoutQuotes}
        options={{
          mode: 'javascript',
          lineWrapping: true,
          theme: 'dracula',
          lineNumbers: true,
          // autoCloseBrackets: true,
          cursorScrollMargin: 48,
          indentUnit: 2,
          tabSize: 2,
          styleActiveLine: true,
          smartIndent: true,
          // lineSeparator: ",",
        }}
        />
        </div>
        <div className="codebox2">
          <CodeMirror
          value={_.isEmpty(graphQLSchema) ? '<h1>GraphQLSchema</h1>' : combined}
          options={{
            mode: 'javascript',
            lineWrapping: true,
            theme: 'dracula',
            lineNumbers: true,
            // lineSeparator: ",",
            // autoCloseBrackets: true,
            cursorScrollMargin: 48,
            indentUnit: 2,
            tabSize: 2,
            styleActiveLine: true,
            smartIndent: true,
          }}
          />
      </div>
    </div>
  )
}

export default MongoSchemaIDE;