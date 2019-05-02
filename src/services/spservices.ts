// João Mendes
// March 2019

import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp, Fields, Web, SearchResults, Field, PermissionKind, RegionalSettings } from '@pnp/sp';
import { graph, } from "@pnp/graph";
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions, HttpClient, MSGraphClient } from '@microsoft/sp-http';
import * as $ from 'jquery';
import { IEventData } from './IEventData';
import { registerDefaultFontFaces } from "@uifabric/styling";
import { EventArgs } from "@microsoft/sp-core-library";
import * as moment from 'moment';
import { SiteUser } from "@pnp/sp/src/siteusers";
import { IUserPermissions } from './IUserPermissions';
import { dateAdd } from "@pnp/common";


const ADMIN_ROLETEMPLATE_ID = "62e90394-69f5-4237-9190-012177145e10"; // Global Admin TemplateRoleId
// Class Services
export default class spservices {

  private graphClient: MSGraphClient = null;

  constructor(private context: WebPartContext) {
    // Setuo Context to PnPjs and MSGraph
    sp.setup({
      spfxContext: this.context
    });

    graph.setup({
      spfxContext: this.context
    });
    // Init
    this.onInit();
  }
  // OnInit Function
  private async onInit() {
    //this.appCatalogUrl = await this.getAppCatalogUrl();

  }

  /**
   *
   * @private
   * @param {string} siteUrl
   * @returns {Promise<number>}
   * @memberof spservices
   */
  private async getSiteTimeZoneHoursToUtc(siteUrl: string): Promise<number> {
    let numberHours: number = 0;
    let siteTimeZoneHoursToUTC: any;
    let siteTimeZoneBias: number;
    let siteTimeZoneDaylightBias: number;
    let currentDateTimeOffSet: number = new Date().getTimezoneOffset() / 60;

    try {
      const siteRegionalSettings: any = await this.getSiteRegionalSettingsTimeZone(siteUrl);
      // Calculate  hour to current site
      siteTimeZoneBias = siteRegionalSettings.Information.Bias;
      siteTimeZoneDaylightBias = siteRegionalSettings.Information.DaylightBias;

      // Formula to calculate the number of  hours need to get UTC Date.
      numberHours = (siteTimeZoneBias / 60) + (siteTimeZoneDaylightBias / 60) - currentDateTimeOffSet;
    }
    catch (error) {
      return Promise.reject(error);
    }
    return numberHours;
  }

  /**
   *
   * @param {IEventData} newEvent
   * @param {string} siteUrl
   * @param {string} listId
   * @returns
   * @memberof spservices
   */
  public async addEvent(newEvent: IEventData, siteUrl: string, listId: string) {
    let results = null;
    try {
      const web = new Web(siteUrl);

      const siteTimeZoneHoursToUTC: number = await this.getSiteTimeZoneHoursToUtc(siteUrl);
      //"Title","fRecurrence", "fAllDayEvent","EventDate", "EndDate", "Description","ID", "Location","Geolocation","ParticipantsPickerId"

      results = await web.lists.getById(listId).items.add({
        Title: newEvent.title,
        Description: newEvent.Description,
        Geolocation: newEvent.geolocation,
        ParticipantsPickerId: { results: newEvent.attendes },
        EventDate: new Date(moment(newEvent.start).add(siteTimeZoneHoursToUTC, 'hours').toISOString()),
        EndDate: new Date(moment(newEvent.end).add(siteTimeZoneHoursToUTC, 'hours').toISOString()),
        Location: newEvent.location,
        fAllDayEvent: false,
        fRecurrence: false,
        Category: newEvent.Category,
      });
    } catch (error) {
      return Promise.reject(error);
    }
    return results;
  }
  /**
   *
   * @param {IEventData} newEvent
   * @param {string} siteUrl
   * @param {string} listId
   * @returns
   * @memberof spservices
   */
  public async updateEvent(updateEvent: IEventData, siteUrl: string, listId: string) {
    let results = null;
    try {

      const siteTimeZoneHoursToUTC: number = await this.getSiteTimeZoneHoursToUtc(siteUrl);

      const web = new Web(siteUrl);
      //"Title","fRecurrence", "fAllDayEvent","EventDate", "EndDate", "Description","ID", "Location","Geolocation","ParticipantsPickerId"
      results = await web.lists.getById(listId).items.getById(updateEvent.id).update({
        Title: updateEvent.title,
        Description: updateEvent.Description,
        Geolocation: updateEvent.geolocation,
        ParticipantsPickerId: { results: updateEvent.attendes },
        EventDate: new Date(moment(updateEvent.start).add(siteTimeZoneHoursToUTC, 'hours').toISOString()),
        EndDate: new Date(moment(updateEvent.end).add(siteTimeZoneHoursToUTC, 'hours').toISOString()),
        Location: updateEvent.location,
        fAllDayEvent: false,
        fRecurrence: false,
        Category: updateEvent.Category,
      });
    } catch (error) {
      return Promise.reject(error);
    }
    return results;
  }

  /**
   *
   * @param {IEventData} event
   * @param {string} siteUrl
   * @param {string} listId
   * @returns
   * @memberof spservices
   */
  public async deleteEvent(event: IEventData, siteUrl: string, listId: string) {
    let results = null;
    try {
      const web = new Web(siteUrl);

      //"Title","fRecurrence", "fAllDayEvent","EventDate", "EndDate", "Description","ID", "Location","Geolocation","ParticipantsPickerId"
      results = await web.lists.getById(listId).items.getById(event.id).delete();
    } catch (error) {
      return Promise.reject(error);
    }
    return results;
  }
  /**
   *
   * @param {number} userId
   * @param {string} siteUrl
   * @returns {Promise<SiteUser>}
   * @memberof spservices
   */
  public async getUserById(userId: number, siteUrl: string): Promise<SiteUser> {
    let results: SiteUser = null;

    if (!userId && !siteUrl) {
      return null;
    }

    try {
      const web = new Web(siteUrl);
      results = await web.siteUsers.getById(userId).get();
      //results = await web.siteUsers.getByLoginName(userId).get();
    } catch (error) {
      return Promise.reject(error);
    }
    return results;
  }

  /**
   *
   *
   * @param {string} loginName
   * @param {string} siteUrl
   * @returns {Promise<SiteUser>}
   * @memberof spservices
   */
  public async getUserByLoginName(loginName: string, siteUrl: string): Promise<SiteUser> {
    let results: SiteUser = null;

    if (!loginName && !siteUrl) {
      return null;
    }

    try {
      const web = new Web(siteUrl);
      await web.ensureUser(loginName);
      results = await web.siteUsers.getByLoginName(loginName).get();
      //results = await web.siteUsers.getByLoginName(userId).get();
    } catch (error) {
      return Promise.reject(error);
    }
    return results;
  }
  /**
   *
   * @param {string} loginName
   * @returns
   * @memberof spservices
   */
  public async getUserProfilePictureUrl(loginName: string) {
    let results: any = null;
    try {
      results = await sp.profiles.getPropertiesFor(loginName);
    } catch (error) {
      results = null;
    }
    return results.PictureUrl;
  }

  /**
   *
   * @param {string} siteUrl
   * @param {string} listId
   * @returns {Promise<IUserPermissions>}
   * @memberof spservices
   */
  public async getUserPermissions(siteUrl: string, listId: string): Promise<IUserPermissions> {
    let hasPermissionAdd: boolean = false;
    let hasPermissionEdit: boolean = false;
    let hasPermissionDelete: boolean = false;
    let hasPermissionView: boolean = false;
    let userPermissions: IUserPermissions = undefined;
    try {
      const web = new Web(siteUrl);
      hasPermissionAdd = await web.lists.getById(listId).currentUserHasPermissions(PermissionKind.AddListItems);
      hasPermissionEdit = await web.lists.getById(listId).currentUserHasPermissions(PermissionKind.EditListItems);
      hasPermissionDelete = await web.lists.getById(listId).currentUserHasPermissions(PermissionKind.DeleteListItems);
      hasPermissionView = await web.lists.getById(listId).currentUserHasPermissions(PermissionKind.ViewListItems);
      userPermissions = { hasPermissionAdd: hasPermissionAdd, hasPermissionEdit: hasPermissionEdit, hasPermissionDelete: hasPermissionDelete, hasPermissionView: hasPermissionView };
    } catch (error) {
      return Promise.reject(error);
    }
    return userPermissions;
  }
  /**
   *
   * @param {string} siteUrl
   * @returns
   * @memberof spservices
   */
  public async getSiteLists(siteUrl: string) {

    let results: any[] = [];

    if (!siteUrl) {
      return [];
    }

    try {
      const web = new Web(siteUrl);
      results = await web.lists.select("Title", "ID").filter('BaseTemplate eq 106').get();

    } catch (error) {
      return Promise.reject(error);
    }
    return results;
  }

  /**
   *
   * @private
   * @returns
   * @memberof spservices
   */
  public async colorGenerate() {

    var hexValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e"];
    var newColor = "#";

    for (var i = 0; i < 6; i++) {
      var x = Math.round(Math.random() * 14);
      var y = hexValues[x];
      newColor += y;
    }
    return newColor;
  }


  /**
   *
   * @param {string} siteUrl
   * @param {string} listId
   * @param {string} fieldInternalName
   * @returns {Promise<{ key: string, text: string }[]>}
   * @memberof spservices
   */
  public async getChoiceFieldOptions(siteUrl: string, listId: string, fieldInternalName: string): Promise<{ key: string, text: string }[]> {
    let fieldOptions: { key: string, text: string }[] = [];
    try {
      const web = new Web(siteUrl);
      const results = await web.lists.getById(listId)
        .fields
        .getByInternalNameOrTitle(fieldInternalName)
        .select("Title", "InternalName", "Choices")
        .get();
      if (results && results.Choices.length > 0) {
        for (const option of results.Choices) {
          fieldOptions.push({
            key: option,
            text: option
          });
        }
      }
    } catch (error) {
      return Promise.reject(error);
    }
    return fieldOptions;
  }

  /**
   *
   * @param {string} siteUrl
   * @param {string} listId
   * @param {Date} eventStartDate
   * @param {Date} eventEndDate
   * @returns {Promise< IEventData[]>}
   * @memberof spservices
   */
  public async getEvents(siteUrl: string, listId: string, eventStartDate: Date, eventEndDate: Date): Promise<IEventData[]> {

    let events: IEventData[] = [];
    if (!siteUrl) {
      return [];
    }
    try {
      // Get Regional Settings TimeZone Hours to UTC
      const siteTimeZoneHoursToUTC: number = await this.getSiteTimeZoneHoursToUtc(siteUrl);
      // Get Category Field Choices
      const categoryDropdownOption = await this.getChoiceFieldOptions(siteUrl, listId, 'Category');
      let categoryColor: { category: string, color: string }[] = [];
      for (const cat of categoryDropdownOption) {
        categoryColor.push({ category: cat.text, color: await this.colorGenerate() });
      }
      const spOpts: ISPHttpClientOptions = {
      };
      const apiUrl = `${siteUrl}/_api/web/Lists(guid'${listId}')/RenderListDataAsStream?SortField=EventDate&SortDir=Asc`;

      const data: SPHttpClientResponse = await this.context.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, {
        body: JSON.stringify({
          parameters: {
            RenderOptions: 3,
            DatesInUtc: true,
            ViewXml: `<View><ViewFields><FieldRef Name='Author'/><FieldRef Name='Category'/><FieldRef Name='Description'/><FieldRef Name='ParticipantsPicker'/><FieldRef Name='Geolocation'/><FieldRef Name='ID'/><FieldRef Name='EndDate'/><FieldRef Name='EventDate'/><FieldRef Name='ID'/><FieldRef Name='Location'/><FieldRef Name='Title'/><FieldRef Name='fAllDayEvent'/></ViewFields><Query><RowLimit Paged=\"FALSE\">2000</RowLimit><Where>
              <And>
               <And>
                <Geq>
                  <FieldRef Name='EventDate' />
                  <Value IncludeTimeValue='false' Type='DateTime'>${moment(eventStartDate).format('YYYY-MM-DD')}</Value>
                </Geq>
                <Leq>
                  <FieldRef Name='EventDate' />
                  <Value IncludeTimeValue='false' Type='DateTime'>${moment(eventEndDate).format('YYYY-MM-DD')}</Value>
                </Leq>
                </And>
                <Eq>
                <FieldRef Name='fRecurrence' />
                  <Value Type='Recurrence'>0</Value>
                </Eq>
              </And>
            </Where></Query></View>`
          }
        })
      }
      );
      if (data.ok) {
        const results = await data.json();

        if (results) {
          if (results.ListData && results.ListData.Row.length > 0) {
            for (const event of results.ListData.Row) {
              const initialsArray: string[] = event.Author[0].title.split(' ');
              const initials: string = initialsArray[0].charAt(0) + initialsArray[initialsArray.length - 1].charAt(0);
              const userPictureUrl = await this.getUserProfilePictureUrl(`i:0#.f|membership|${event.Author[0].email}`);
              const attendees: number[] = [];
              const first: number = event.Geolocation.indexOf('(') + 1;
              const last: number = event.Geolocation.indexOf(')');
              const geo = event.Geolocation.substring(first, last);
              const geolocation = geo.split(' ');
              const CategoryColorValue: any[] = categoryColor.filter((value) => {
                return value.category == event.Category;
              });
              for (const attendee of event.ParticipantsPicker) {
                attendees.push(parseInt(attendee.id));
              }

              events.push({
                id: event.ID,
                title: event.Title,
                Description: event.Description,
                //  start: moment(event.EventDate).utc().toDate().setUTCMinutes(this.siteTimeZoneOffSet),
                start: new Date(moment(event.EventDate).subtract(siteTimeZoneHoursToUTC, 'hour').toISOString()),
                // end: new Date(moment(event.EndDate).toLocaleString()),
                end: new Date(moment(event.EndDate).subtract(siteTimeZoneHoursToUTC, 'hour').toISOString()),
                location: event.Location,
                ownerEmail: event.Author[0].email,
                ownerPhoto: userPictureUrl ?
                  `https://outlook.office365.com/owa/service.svc/s/GetPersonaPhoto?email=${event.Author[0].email}&UA=0&size=HR96x96` : '',
                ownerInitial: initials,
                // color: await this.colorGenerate(),
                color: CategoryColorValue.length > 0 ? CategoryColorValue[0].color : await this.colorGenerate,
                ownerName: event.Author[0].title,
                attendes: attendees,
                allDayEvent: false,
                geolocation: { Longitude: parseFloat(geolocation[0]), Latitude: parseFloat(geolocation[1]) },
                Category: event.Category
              });
            }
          }

        }
      }
      else { // Status not OK
        throw new Error(`Error reading calendar events: ${data.statusMessage}`);
      }
      // Return Data
      return events;
    } catch (error) {
      console.dir(error);
      return Promise.reject(error);
    }
  }

  /**
   *
   * @private
   * @param {string} siteUrl
   * @returns
   * @memberof spservices
   */
  public async getSiteRegionalSettingsTimeZone(siteUrl: string) {
    let regionalSettings: RegionalSettings;
    try {
      const web = new Web(siteUrl);
      regionalSettings = await web.regionalSettings.timeZone.get();

    } catch (error) {
      return Promise.reject(error);
    }
    return regionalSettings;
  }
  /**
   * @param {string} webUrl
   * @param {string} siteDesignId
   * @returns
   * @memberof spservices
   */
  public async getGeoLactionName(latitude: number, longitude: number) {
    try {
      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
      const results = await $.ajax({
        url: apiUrl,
        type: 'GET',
        dataType: 'json',
        headers: {
          'content-type': 'application/json;charset=utf-8',
          'accept': 'application/json;odata=nometadata',
        }
      });

      if (results) {
        return results;
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
