const express = require('express'),
  helmet = require('helmet'),
  compression = require('compression'),
  app = express(),
  http = require('http'),
  fs = require('fs-extra'),
  path = require('path'),
  formidable = require('formidable'),
  server = http.createServer(app),
  languages = require('./languages'),
  _ = require('lodash'),
  args = process.argv.slice(2).reduce((acc, textParam) => {
    let param = textParam.split('=');
    if (param.length > 0)
      acc[param[0]] = param[1];
    return acc;
  }, {});
app.use(helmet());
app.use(compression());
app.use('/build', express.static(path.join(__dirname, 'build')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));
app.use('/temp', express.static(path.join(__dirname, 'temp')));
app.use('/api/locals', (req, res) => {
  let result = {};
  languages.forEach(lang => {
    fs.readdirSync(path.join(__dirname, `files/${lang}`)).forEach(file => {
      const {name} = path.parse(file);
      result[name] = result[name] || {};
      result[name][lang] = 1;
    });
  });
  let resultArr = Object.keys(result).map(fileName => {
    let item = {name: fileName};
    languages.reduce((acc, lang) => {
      acc[lang] = result[fileName][lang] == 1;
      return acc;
    }, item);
    return item;
  });
  res.send(resultArr)
});
app.use('/api/file/:name', (req, res) => {
  let {name} = req.params;
  let result = languages.reduce((result, lang) => {
    result[lang] = getFile(lang, name);
    return result;
  }, {});
  let test = reverseToFL(result);
  res.send(test);
});
app.use('/api/csv/empty.csv/:name?', (req, res) => {
  let json;
  let {name} = req.params;
  if (name)
    json = collectFieldLangKeyOne(name);
  else
    json = collectFieldLangKey();
  let fkl = toFieldKeyLang(json);
  let empty = filterFieldKeyLang(fkl);
  let csv = FKLtoCSV(empty);
  let filePath = path.join(__dirname, `temp/empty.csv`);
  fs.writeFileSync(filePath, csv, {encoding: 'utf8'});

  res.setHeader('Content-Disposition', 'attachment; filename=empty.csv');
  res.setHeader('Content-Transfer-Encoding', 'binary');
  res.setHeader('Content-Type', 'application/octet-stream');
  res.sendFile(filePath)
});
app.use('/api/upload', (req, res) => {
  let form = new formidable.IncomingForm();
  form.parse(req);
  form.on('file', function (name, file) {
    let text = fs.readFileSync(file.path, 'utf8');
    let [first, ...rows] = text.split('\r\n');
    let [k, ...langs] = first.split('\t');
    let json = langs.map(lang => lang.trim()).reduce((acc, lang, i) => {
      acc[lang] = {};
      rows.forEach(row => {
        let [fieldKey, ...values] = row.split('\t');
        let value = values[i] || '';

        if (fieldKey && !fieldKey.startsWith('metas')) {
          let [field, key] = fieldKey.trim().split('.');
          acc[lang][field] = acc[lang][field] || {};
          acc[lang][field][key] = value.trim();
        }
      });
      return acc;
    }, {});

    for (let lang in json) {
      for (let field in json[lang]) {
        let addition = json[lang][field];
        let filePath = path.join(__dirname, `files/${lang}/${field}.json`);
        let fileJson ={};
        if(fs.existsSync(filePath)){
          let fileText = fs.readFileSync(filePath, 'utf8');
          try {
             fileJson = JSON.parse(fileText);
          }
          catch (e) {

          }
        }


        let newJson = Object.assign(fileJson, addition);
        fs.ensureFileSync(filePath);
        fs.writeJsonSync(filePath, newJson, {spaces: 2})
      }
    }
    res.send(200);
  });

});
app.use('/', (req, res) => {
  res.sendFile('index.html', {root: __dirname})
});
app.set('port', args.port || process.env.PORT || '3000');

server.listen(app.get('port'), function () {
  console.log(`Приложение запущено http://localhost:${app.get('port')}`);
});

function collectFieldLangKey() {
  let result = {};
  languages.forEach(lang => {
    fs.readdirSync(path.join(__dirname, `files/${lang}`)).forEach(fileName => {
      let fullPath = path.join(__dirname, `files/${lang}/${fileName}`);
      const {name} = path.parse(fileName);
      if (fs.existsSync(fullPath)) {
        let jsonText = fs.readFileSync(fullPath, 'utf8');
        result[name] = result[name] || {};
        result[name][lang] = JSON.parse(jsonText);
      }
    });
  });
  return result;
}

function collectFieldLangKeyOne(name) {
  let result = {};
  languages.forEach(lang => {
    let fullPath = path.join(__dirname, `files/${lang}/${name}.json`);
    if (fs.existsSync(fullPath)) {
      let jsonText = fs.readFileSync(fullPath, 'utf8');
      result[name] = result[name] || {};
      result[name][lang] = JSON.parse(jsonText);
    }
  });
  return result;
}

function toFieldKeyLang(obj) {
  let result = {};
  for (let field in obj) {
    result[field] = {};
    for (let lang in obj[field]) {
      for (let key in obj[field][lang]) {
        let value = obj[field][lang][key];
        result[field][key] = result[field][key] || {};
        result[field][key][lang] = value;
      }
    }
  }
  return result;
}

function filterFieldKeyLang(obj) {
  for (let field in obj) {
    for (let key in obj[field]) {
      let toDelete = true;
      languages.forEach(lang => {
        let value = obj[field][key][lang];
        if (_.isEmpty(value)) {
          toDelete = false;
        }
      });
      if (toDelete)
        delete obj[field][key];
    }
    if (_.isEmpty(obj[field]))
      delete obj[field];
  }

  return obj;
}

function FKLtoCSV(obj) {
  let csvArr = [];
  csvArr.push(`key\t${languages.join('\t')}`);
  for (let field in obj) {
    for (let key in obj[field]) {
      if (field === 'metas') {
        let complicate = {};
        languages.forEach(lang => {
          let value = obj[field][key][lang] || '';
          let tKey = `${field}.${key}.title`;
          complicate[tKey] = complicate[tKey] || {};
          complicate[tKey][lang] = value.title;
          value.meta && value.meta.forEach((m, i) => {
            let mKey = `${field}.${key}.${m.name}`;
            complicate[mKey] = complicate[mKey] || {};
            complicate[mKey][lang] = m.content
          });
        });


        Object.keys(complicate).map(key => {
          let row = [key];
          languages.forEach(lang => {
            row.push(complicate[key][lang] || "");
          });
          csvArr.push(row.join('\t'));
        });
      } else {
        let row = [`${field}.${key}`];
        languages.forEach(lang => {
          let value = obj[field][key][lang] || '';
          row.push(value);
        });
        csvArr.push(row.join('\t'));
      }
    }
  }
  return csvArr.join('\r\n')
}

function getFile(lang, field) {
  let json;
  let fullPath = path.join(__dirname, `files/${lang}/${field}.json`);
  if (fs.existsSync(fullPath)) {
    let jsonText = fs.readFileSync(fullPath, 'utf8');
    json = JSON.parse(jsonText);
  }
  return json;
}

function reverseToFL(obj) {
  return Object.keys(obj).reduce((result, lang) => {
    let langData = obj[lang];
    if(!langData)
      return result;
    return Object.keys(langData).reduce((result, field) => {
      result[field] = result[field] || {};
      result[field][lang] = obj[lang][field];
      return result;
    }, result);
  }, {});
}
