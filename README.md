# Graph
Angular module for managing graphics with the library [D3js](https://d3js.org/)

## Installazione
Add the path _@graph_ in the `tsconfig.json` file:
```
  ...

    "paths": {
      "@graph/*": [
        "src/graph/*"
      ]
    }

  ...

```
Install the D3Js libraries in case in the `package.json`:
```
npm install --save d3
npm install --save-dev @types/d3
```

## Components

### Line Chart
To create line graphs you need to configure the following parameters:

* title: graph's title
* width: graph's width
* height: graph's hright
* data: data array with the given properties, value

Es.:

```
data = [
  {date: 2011-10-01, value: 62.7},
  {date: 2011-10-02, value: 59.9},
  {date: 2011-10-03, value: 59.1},
  {date: 2011-10-04, value: 58.8},
  {date: 2011-10-05, value: 58.7},
  {date: 2011-10-06, value: 57},
  {date: 2011-10-07, value: 56.7},
  {date: 2011-10-08, value: 56.8},
  {date: 2011-10-09, value: 56.7},
  {date: 2011-10-10, value: 60.1},
  {date: 2011-10-11, value: 61.1},
  {date: 2011-10-12, value: 61.5},
  {date: 2011-10-13, value: 64.3},
  {date: 2011-10-14, value: 67.1},
  {date: 2011-10-15, value: 64.6},
  {date: 2011-10-16, value: 61.6},
  {date: 2011-10-17, value: 61.1},
  {date: 2011-10-18, value: 59.2},
  {date: 2011-10-19, value: 58.9},
  {date: 2011-10-20, value: 57.2}



