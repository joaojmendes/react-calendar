# React Calendar

## Summary
This Web Part allows you to manage events on a calendar.
Uses an existing calender list on any site.
The location and name of the list is defined in the properties of the web part and the events to show, we need to select the start and end dates of  event date.

Each category has it own color that is generated on load.

The Web Part check the user permissions for View, Add, Edit and Delete events



##  Web Part  - Screenshots
![callendar](/assets/screen1.png)


![callendar](/assets/screen1.0.png)


![callendar](/assets/screen1.1.png)


![callendar](/assets/screen1.2.png)


![callendar](/assets/screen1.3.png)


![callendar](/assets/screen1.4.png)


![callendar](/assets/screen2.png)



![callendar](/assets/screen3.png)



![callendar](/assets/screen4.png)



![callendar](/assets/screen5.png)


![callendar](/assets/screen6.png)


![callendar](/assets/screen7.png)


![callendar](/assets/screen8.png)



![callendar](/assets/screen9.png)
##   
 

 



## Used SharePoint Framework Version 
![drop](https://img.shields.io/badge/version-GA-green.svg)

## Applies to

* [SharePoint Framework](https:/dev.office.com/sharepoint)
* [Office 365 tenant](https://dev.office.com/sharepoint/docs/spfx/set-up-your-development-environment)

> Update accordingly as needed.

## WebPart Properties
 
Property |Type|Required| comments
--------------------|----|--------|----------
Site Url of Calendar List | Text| yes|
Calendar list| Text| yes|  this is filled with all list of  type "event list" created
 

## Solution
The Web Part Use PnPjs library, Office-ui-fabric-react components.

Solution|Author(s)
--------|---------
Calendar  Web Part|João Mendes

## Version history

Version|Date|Comments
-------|----|--------
1.0.0|April 25, 2019|Initial release

## Disclaimer
**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- in the command line run:
  - `npm install`
  - `gulp build`
  - `gulp bundle --ship`
  - `gulp package-solution --ship`
  - `Add to AppCatalog and deploy`




<img src="https://telemetry.sharepointpnp.com/sp-dev-fx-webparts/samples/readme-template" />
