import assert from "assert";
import {parse} from "../json.mjs";


{
    const jo = {
        "Image": {
            "Width": 800,
            "Height": 600,
            "Title": "View from 15th Floor",
            "Thumbnail": {
                "Url": "http://www.example.com/image/481989943",
                "Height": 125,
                "Width": 100
            },
            "Animated": false,
            "IDs": [116, 943, 234, 38793]
        }
    }

    const joStr = String.raw`{
        "Image": {
            "Width":  800,
            "Height": 600,
            "Title":  "View from 15th Floor",
            "Thumbnail": {
                "Url":    "http://www.example.com/image/481989943",
                "Height": 125,
                "Width":  100
            },
            "Animated" : false,
            "IDs": [116, 943, 234, 38793]
          }
      }
`

    assert.deepEqual(jo, parse(joStr))


}


{
    const simpleJsonStr = `{"name": "wzk", "age":25, "hobby":["coding", "movie"]}`
    const myJsonObj = parse(simpleJsonStr)
    assert.deepEqual(myJsonObj, {name: "wzk", age: 25, hobby: ["coding", "movie"]})

    const jsonObj = `
    {
  "Thumbnail": {
    "Url": "http://www.example.com/image/481989943",
    "Height": 125,
    "Width": 100
  }
}
    `
    const jo = parse(jsonObj)
    assert.deepEqual(jo, {
        "Thumbnail": {
            "Url": "http://www.example.com/image/481989943",
            "Height": 125,
            "Width": 100
        }
    })


    {
        const complicatedStr = `{
  "Image": {
    "Width": 800,
    "Height": 600,
    "Title": "View from 15th Floor",
    "Thumbnail": {
      "Url": "http://www.example.com/image/481989943",
      "Height": 125,
      "Width": 100
    },
    "Animated": false,
    "IDs": [
      116,
      943,
      234,
      38793
    ]
  },
  "Locations": [
    {
      "precision": "zip",
      "Latitude": 37.7668,
      "Longitude": 122.3959,
      "Address": "",
      "City": "SAN FRANCISCO",
      "State": "CA",
      "Zip": "94107",
      "Country": "US"
    },
    {
      "precision": "zip",
      "Latitude": -37.371991,
      "Longitude": 122.026020,
      "Address": "",
      "City": "SUNNYVALE",
      "State": "CA",
      "Zip": "94085",
      "Country": "US"
    }
  ]
}`
        const res = parse(complicatedStr)
        assert.deepEqual(res, {
            "Image": {
                "Width": 800,
                "Height": 600,
                "Title": "View from 15th Floor",
                "Thumbnail": {
                    "Url": "http://www.example.com/image/481989943",
                    "Height": 125,
                    "Width": 100
                },
                "Animated": false,
                "IDs": [
                    116,
                    943,
                    234,
                    38793
                ]
            },
            "Locations": [
                {
                    "precision": "zip",
                    "Latitude": 37.7668,
                    "Longitude": 122.3959,
                    "Address": "",
                    "City": "SAN FRANCISCO",
                    "State": "CA",
                    "Zip": "94107",
                    "Country": "US"
                },
                {
                    "precision": "zip",
                    "Latitude": -37.371991,
                    "Longitude": 122.026020,
                    "Address": "",
                    "City": "SUNNYVALE",
                    "State": "CA",
                    "Zip": "94085",
                    "Country": "US"
                }
            ]
        })
    }

    const s2 = `{
"problems": [{
    "Diabetes":[{
        "medications":[{
            "medicationsClasses":[{
                "className":[{
                    "associatedDrug":[{
                        "name":"asprin",
                        "dose":"",
                        "strength":"500 mg"
                    }],
                    "associatedDrug#2":[{
                        "name":"somethingElse",
                        "dose":"",
                        "strength":"500 mg"
                    }]
                }],
                "className2":[{
                    "associatedDrug":[{
                        "name":"asprin",
                        "dose":"",
                        "strength":"500 mg"
                    }],
                    "associatedDrug#2":[{
                        "name":"somethingElse",
                        "dose":"",
                        "strength":"500 mg"
                    }]
                }]
            }]
        }],
        "labs":[{
            "missing_field": "missing_value"
        }]
    }],
    "Asthma":[{}]
}]}`
    const s2Obj = {
        "problems": [{
            "Diabetes": [{
                "medications": [{
                    "medicationsClasses": [{
                        "className": [{
                            "associatedDrug": [{
                                "name": "asprin",
                                "dose": "",
                                "strength": "500 mg"
                            }],
                            "associatedDrug#2": [{
                                "name": "somethingElse",
                                "dose": "",
                                "strength": "500 mg"
                            }]
                        }],
                        "className2": [{
                            "associatedDrug": [{
                                "name": "asprin",
                                "dose": "",
                                "strength": "500 mg"
                            }],
                            "associatedDrug#2": [{
                                "name": "somethingElse",
                                "dose": "",
                                "strength": "500 mg"
                            }]
                        }]
                    }]
                }],
                "labs": [{
                    "missing_field": "missing_value"
                }]
            }],
            "Asthma": [{}]
        }]
    }
    assert.deepEqual(parse(s2), s2Obj)
}