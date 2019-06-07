import * as React from 'react';
import styles from './EventRecurrenceInfoDaily.module.scss';
import * as strings from 'CalendarWebPartStrings';
import { IEventRecurrenceInfoMonthlyProps } from './IEventRecurrenceInfoMonthlyProps';
import { IEventRecurrenceInfoMonthlyState } from './IEventRecurrenceInfoMonthlyState';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from 'moment';
import { parseString, Builder } from "xml2js";
import {
  ChoiceGroup,
  IChoiceGroupOption,
  Dropdown,
  IDropdownOption,
  TextField,
  SpinButton,
  Label,
  PrimaryButton,
  MaskedTextField,
  CommandBarButton, IButtonProps,
  DefaultButton
} from 'office-ui-fabric-react';
import { Position } from 'office-ui-fabric-react/lib/utilities/positioning';
import { Root } from '@pnp/graph';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import { _MinimalWebPartContainer } from '@microsoft/sp-webpart-base';
import spservices from '../../services/spservices';

const DayPickerStrings: IDatePickerStrings = {
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

  shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

  shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],

  goToToday: 'Go to today',
  prevMonthAriaLabel: 'Go to previous month',
  nextMonthAriaLabel: 'Go to next month',
  prevYearAriaLabel: 'Go to previous year',
  nextYearAriaLabel: 'Go to next year',
  closeButtonAriaLabel: 'Close date picker'
};

/**
 *
 *
 * @export
 * @class EventRecurrenceInfoDaily
 * @extends {React.Component<IEventRecurrenceInfoMonthlyProps, IEventRecurrenceInfoMonthlyState>}
 */
export class EventRecurrenceInfoMonthly extends React.Component<IEventRecurrenceInfoMonthlyProps, IEventRecurrenceInfoMonthlyState> {
  private spService: spservices = null;
  public constructor(props) {
    super(props);


    this.onPaternChange = this.onPaternChange.bind(this);
    this.state = {
      selectedKey: 'daily',
      selectPatern: 'monthly',
      startDate: this.props.startDate ? this.props.startDate : moment().toDate(),
      endDate: moment().endOf('month').toDate(),
      numberOcurrences: '1',
      disableDayOfMonth: false,
      disableNumberOcurrences: true,
      selectdateRangeOption: 'noDate',
      disableEndDate: true,
      selectedRecurrenceRule: 'monthly',
      dayOfMonth: this.props.startDate ? moment(this.props.startDate).format('D') : moment().format('D'),
      everyNumberOfMonths: '1',
      isLoading: false,
      errorMessageNumberOfMonth: '',
      errorMessageDayOfMonth: '',
      selectedWeekOrderMonth: 'first',
      selectedWeekDay: 'day',
      errorMessageNumberOfMonthWeekDay: '',
      everyNumberOfMonthsWeekDay: '1',
    };

    //
    this.onDayOfMonthChange = this.onDayOfMonthChange.bind(this);
    this.onNumberOfOcurrencesChange = this.onNumberOfOcurrencesChange.bind(this);
    this.onDataRangeOptionChange = this.onDataRangeOptionChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.onApplyRecurrence = this.onApplyRecurrence.bind(this);
    this.onDayOfMonthGetErrorMessage = this.onDayOfMonthGetErrorMessage.bind(this);
    this.onEveryNumberOfMonthsChange = this.onEveryNumberOfMonthsChange.bind(this);
    this.onEveryNumberOfMonthsWeekDayChange = this.onEveryNumberOfMonthsWeekDayChange.bind(this);
    this.onSelectedWeekDayChange = this.onSelectedWeekDayChange.bind(this);
    this.onWeekOrderMonthChange = this.onWeekOrderMonthChange.bind(this);

    this.spService = new spservices(this.props.context);
  }

  /**
   *
   *
   * @private
   * @param {Date} date
   * @memberof EventRecurrenceInfoDaily
   */
  private onStartDateChange(date: Date) {
    this.setState({ startDate: date });
    this.applyRecurrence();
  }

  /**
   *
   *
   * @private
   * @param {Date} date
   * @memberof EventRecurrenceInfoDaily
   */
  private onEndDateChange(date: Date) {
    this.setState({ endDate: date });
    this.applyRecurrence();
  }

  /**
   *
   *
   * @private
   * @param {React.SyntheticEvent<HTMLElement>} ev
   * @param {string} value
   * @memberof EventRecurrenceInfoDaily
   */
  private onDayOfMonthChange(ev: React.SyntheticEvent<HTMLElement>, value: string) {
    ev.preventDefault();
    setTimeout(() => {
      let errorMessage = '';
      if (Number(value.trim()) == 0 || Number(value.trim()) > 31) {
        value = '1 ';
        errorMessage = 'Alowed values 1 to 31';
      }
      this.setState({ dayOfMonth: value, errorMessageDayOfMonth: errorMessage });
      this.applyRecurrence();
    }, 2500);

  }

  /**
   *
   *
   * @private
   * @param {string} value
   * @returns
   * @memberof EventRecurrenceInfoMonthly
   */
  private onDayOfMonthGetErrorMessage(value: string) {
    return (Number(value.trim()) != 0 && Number(value.trim()) <= 31) ? '' : "Day must be beteween 1 and 31";
  }
  /**
   *
   *
   * @private
   * @param {React.SyntheticEvent<HTMLElement>} ev
   * @param {string} value
   * @memberof EventRecurrenceInfoMonthly
   */
  private onEveryNumberOfMonthsChange(ev: React.SyntheticEvent<HTMLElement>, value: string) {
    ev.preventDefault();
    setTimeout(() => {
      let errorMessage = '';
      if (Number(value.trim()) == 0 || Number(value.trim()) > 12) {
        value = '1 ';
        errorMessage = 'Alowed values 1 to 12';
      }
      this.setState({ everyNumberOfMonths: value, errorMessageNumberOfMonth: errorMessage });
      this.applyRecurrence();
    }, 2500);


  }
  /**
   *
   *
   * @private
   * @param {React.SyntheticEvent<HTMLElement>} ev
   * @param {string} value
   * @memberof EventRecurrenceInfoMonthly
   */
  private onEveryNumberOfMonthsWeekDayChange(ev: React.SyntheticEvent<HTMLElement>, value: string) {
    ev.preventDefault();
    setTimeout(() => {
      let errorMessage = '';
      if (Number(value.trim()) == 0 || Number(value.trim()) > 12) {
        value = '1 ';
        errorMessage = 'Alowed values 1 to 12';
      }
      this.setState({ everyNumberOfMonthsWeekDay: value, errorMessageNumberOfMonthWeekDay: errorMessage });
      this.applyRecurrence();
    }, 2500);


  }
  /**
   *
   *
   * @private
   * @param {React.SyntheticEvent<HTMLElement>} ev
   * @param {string} value
   * @memberof EventRecurrenceInfoDaily
   */
  private onNumberOfOcurrencesChange(ev: React.SyntheticEvent<HTMLElement>, value: string) {
    ev.preventDefault();
    this.setState({ numberOcurrences: value });
    this.applyRecurrence();
  }

  /**
   *
   *
   * @private
   * @param {React.SyntheticEvent<HTMLElement>} ev
   * @param {IChoiceGroupOption} option
   * @memberof EventRecurrenceInfoDaily
   */
  private onDataRangeOptionChange(ev: React.SyntheticEvent<HTMLElement>, option: IChoiceGroupOption): void {
    ev.preventDefault();

    this.setState({
      selectdateRangeOption: option.key,
      disableNumberOcurrences: option.key == 'endAfter' ? false : true,
      disableEndDate: option.key == 'endDate' ? false : true,
    });
    this.applyRecurrence();
  }


  /**
   *
   *
   * @private
   * @param {React.SyntheticEvent<HTMLElement>} ev
   * @param {IChoiceGroupOption} option
   * @memberof EventRecurrenceInfoMonthly
   */
  private onPaternChange(ev: React.SyntheticEvent<HTMLElement>, option: IChoiceGroupOption): void {
    ev.preventDefault();
    this.setState({
      selectPatern: option.key,
      disableDayOfMonth: option.key == 'monthly' ? false : true,
    });
    this.applyRecurrence();
  }

  public async componentDidMount() {
    //  await this.load();
    await this.load();
  }


  /**
   *
   *
   * @private
   * @param {React.FormEvent<HTMLDivElement>} ev
   * @param {IDropdownOption} item
   * @memberof EventRecurrenceInfoMonthly
   */
  private  onWeekOrderMonthChange(ev: React.FormEvent<HTMLDivElement>, item: IDropdownOption):void {
    this.setState({selectedWeekOrderMonth: item.text});
    this.applyRecurrence();
  }

  /**
   *
   *
   * @private
   * @param {React.FormEvent<HTMLDivElement>} ev
   * @param {IDropdownOption} item
   * @memberof EventRecurrenceInfoMonthly
   */
  private onSelectedWeekDayChange(ev: React.FormEvent<HTMLDivElement>, item: IDropdownOption):void {
    this.setState({selectedWeekDay: item.text});
    this.applyRecurrence();
  }

  public async  componentDidUpdate(prevProps: IEventRecurrenceInfoMonthlyProps, prevState: IEventRecurrenceInfoMonthlyState) {

  }

  /**
   *
   *
   * @private
   * @memberof EventRecurrenceInfoMonthly
   */
  private async load() {
    let patern: any = {};
    let dateRange: { repeatForever?: string, repeatInstances?: string, windowEnd?: Date } = {};
    let monthlyPatern: { monthFrequency?: string, day?: string } = {};
    let monthlyByDayPatern: { monthFrequency?: string, weekdayOfMonth?: string, weekDay?: string } = {};
    let recurrenceRule: string;

    if (this.props.recurrenceData) {

      parseString(this.props.recurrenceData, { explicitArray: false }, (error, result) => {

        if (result.recurrence.rule.repeat) {
          patern = result.recurrence.rule.repeat;
        }

        //
        if (result.recurrence.rule.repeatForever) {
          dateRange = { repeatForever: result.recurrence.rule.repeatForever };
        }
        if (result.recurrence.rule.repeatInstances) {
          dateRange = { repeatInstances: result.recurrence.rule.repeatInstances };
        }
        if (result.recurrence.rule.windowEnd) {
          dateRange = { windowEnd: result.recurrence.rule.windowEnd };
        }

      });
      // monthly Patern
      if (patern.monthly) {
        recurrenceRule = 'monthly';
        if (patern.monthly.$.monthFrequency && patern.monthly.$.day) {
          monthlyPatern = { monthFrequency: patern.monthly.$.monthFrequency, day: patern.monthly.$.day };
        }
      }
      // monthlyByDay Patern
      if (patern.monthlyByDay) {
        recurrenceRule = 'monthly';
        let weekDay = 'day';

        if (patern.monthlyByDay.$.su) weekDay = 'sunday';
        if (patern.monthlyByDay.$.mo) weekDay = 'monday';
        if (patern.monthlyByDay.$.tu) weekDay = 'tuesday';
        if (patern.monthlyByDay.$.we) weekDay = 'wednesday';
        if (patern.monthlyByDay.$.th) weekDay = 'thursday';
        if (patern.monthlyByDay.$.fr) weekDay = 'friday';
        if (patern.monthlyByDay.$.sa) weekDay = 'saturday';
        if (patern.monthlyByDay.$.day) weekDay = 'day';
        if (patern.monthlyByDay.$.weekday) weekDay = 'weekday';
        if (patern.monthlyByDay.$.weekend_day) weekDay = 'weekdendday';

        monthlyByDayPatern = {
          monthFrequency: patern.monthlyByDay.$.monthFrequency,
          weekdayOfMonth: patern.monthlyByDay.$.weekdayOfMonth,
          weekDay: weekDay,
        };

      }

      let selectDateRangeOption: string = 'noDate';
      if (dateRange.repeatForever) {
        selectDateRangeOption = 'noDate';
      } else if (dateRange.repeatInstances) {
        selectDateRangeOption = 'endAfter';
      } else if (dateRange.windowEnd) {
        selectDateRangeOption = 'endDate';
      }
      //  selectDateRangeOption = dateRange.repeatForever ? 'noDate' : null;
      //  selectDateRangeOption = dateRange.repeatInstances ? 'endAfter' : null;
      //  selectDateRangeOption = dateRange.windowEnd ? 'endDate' : 'noDate';

      console.log(selectDateRangeOption, new Date(moment(dateRange.windowEnd).format('YYYY/MM/DD')));
      // weekday patern
      this.setState({
        selectedRecurrenceRule: recurrenceRule,
        selectPatern: patern.monthly ? 'monthly' : 'monthlyByDay',
        dayOfMonth: monthlyPatern.day ? monthlyPatern.day : '1',
        everyNumberOfMonths: monthlyPatern.monthFrequency ?  monthlyPatern.monthFrequency : monthlyByDayPatern.monthFrequency ,
        everyNumberOfMonthsWeekDay: monthlyByDayPatern.monthFrequency,
        selectedWeekOrderMonth: monthlyByDayPatern.weekdayOfMonth ? monthlyByDayPatern.weekdayOfMonth : 'first',
        selectedWeekDay: monthlyByDayPatern.weekDay,
        disableDayOfMonth: patern.monthly ? false : true,
        selectdateRangeOption: selectDateRangeOption,
        numberOcurrences: dateRange.repeatInstances ? dateRange.repeatInstances : '1',
        disableNumberOcurrences: dateRange.repeatInstances ? false : true,
        endDate: dateRange.windowEnd ? new Date(moment(dateRange.windowEnd).format('YYYY/MM/DD')) : this.state.endDate,
        disableEndDate: dateRange.windowEnd ? false : true,
        isLoading: false,
      });
    }
    await this.applyRecurrence();
  }


  /**
   *
   *
   * @private
   * @param {React.MouseEvent<HTMLButtonElement>} ev
   * @memberof EventRecurrenceInfoMonthly
   */
  private async onApplyRecurrence(ev: React.MouseEvent<HTMLButtonElement>) {
    await this.applyRecurrence();
  }
  /**
   *
   *
   * @private
   * @param {React.MouseEvent<HTMLButtonElement>} ev
   * @memberof EventRecurrenceInfoDaily
   */
  private async applyRecurrence() {

    const siteTimeZoneHours: number = await this.spService.getSiteTimeZoneHours(this.props.siteUrl);
    const eventDate = new Date(moment(this.state.startDate).add(siteTimeZoneHours, 'hours').toISOString());
    const endDate = moment(this.state.endDate).add(siteTimeZoneHours, 'hours').toISOString();
    let selectDateRangeOption;
    switch (this.state.selectdateRangeOption) {
      case 'noDate':
        selectDateRangeOption = `<repeatForever>FALSE</repeatForever>`;
        break;
      case 'endAfter':
        selectDateRangeOption = `<repeatInstances>${this.state.numberOcurrences}</repeatInstances>`;
        break;
      case 'endDate':
        selectDateRangeOption = `<windowEnd>${endDate}</windowEnd>`;
        break;
      default:
        break;
    }
    let recurrencePatern: string = '';
    if (this.state.selectPatern == 'monthly') {
      recurrencePatern = `<monthly  monthFrequency="${this.state.everyNumberOfMonths}" day="${this.state.dayOfMonth}" /></repeat>${selectDateRangeOption}</rule></recurrence>`;
    }

    if (this.state.selectPatern == 'monthlyByDay') {

      recurrencePatern = `<monthlyByDay weekdayOfMonth="${this.state.selectedWeekOrderMonth}" `;
      switch (this.state.selectedWeekDay) {
        case 'day':
          recurrencePatern = recurrencePatern + `day="TRUE"`;
          break;
        case 'weekday':
          recurrencePatern = recurrencePatern + `weekday="TRUE"`;
          break;
        case 'weekendday':
          recurrencePatern = recurrencePatern + `weekend_day="TRUE"`;
          break;
        case 'sunday':
          recurrencePatern = recurrencePatern + `su="TRUE"`;
          break;
        case 'monday':
          recurrencePatern = recurrencePatern + `mo="TRUE"`;
          break;
        case 'tuesday':
          recurrencePatern = recurrencePatern + `tu="TRUE"`;
          break;
        case 'wednesday':
          recurrencePatern = recurrencePatern + `we="TRUE"`;
          break;
        case 'thursday':
          recurrencePatern = recurrencePatern + `th="TRUE"`;
          break;
        case 'friday':
          recurrencePatern = recurrencePatern + `fr="TRUE"`;
          break;
        case 'saturday':
          recurrencePatern = recurrencePatern + `sa="TRUE"`;
          break;
        default:
          break;
      }

      recurrencePatern = recurrencePatern + ` monthFrequency="${this.state.everyNumberOfMonthsWeekDay}" /></repeat>${selectDateRangeOption}</rule></recurrence>`;
    }

    const recurrenceXML = `<recurrence><rule><firstDayOfWeek>su</firstDayOfWeek><repeat>` + recurrencePatern;

    console.log(recurrenceXML);
    this.props.returnRecurrenceData(eventDate, recurrenceXML);
  }
  /**
   *
   *
   * @returns {React.ReactElement<IEventRecurrenceInfoDailyProps>}
   * @memberof EventRecurrenceInfoDaily
   */
  public render(): React.ReactElement<IEventRecurrenceInfoMonthlyProps> {
    return (
      <div >
        {
          <div>
            <div style={{ display: 'inline-block', float: 'right', paddingTop: '10px', height: '40px' }}>

            </div>
            <div style={{ width: '100%', paddingTop: '10px' }}>
              <Label>Patern</Label>
              <ChoiceGroup
                selectedKey={this.state.selectPatern}
                options={[
                  {
                    key: 'monthly',
                    text: 'day',
                    ariaLabel: 'day',

                    onRenderField: (props, render) => {
                      return (
                        <div  >
                          {render!(props)}
                          <MaskedTextField
                            styles={{ root: { display: 'inline-block', verticalAlign: 'top', width: '100px', paddingLeft: '10px' } }}
                            mask="99"
                            maskChar=' '
                            disabled={this.state.disableDayOfMonth}
                            value={this.state.dayOfMonth}

                            errorMessage={this.state.errorMessageDayOfMonth}
                            onChange={this.onDayOfMonthChange} />
                          <Label styles={{ root: { display: 'inline-block', verticalAlign: 'top', width: '65px', paddingLeft: '10px' } }}>of every </Label>
                          <MaskedTextField
                            styles={{ root: { display: 'inline-block', verticalAlign: 'top', width: '100px', paddingLeft: '10px' } }}
                            mask="99"
                            maskChar=' '
                            disabled={this.state.disableDayOfMonth}
                            value={this.state.everyNumberOfMonths}
                            errorMessage={this.state.errorMessageNumberOfMonth}
                            onChange={this.onEveryNumberOfMonthsChange} />
                          <Label styles={{ root: { display: 'inline-block', verticalAlign: 'top', width: '100px', paddingLeft: '10px' } }}>month(s)</Label>
                        </div>
                      );
                    }
                  },
                  {
                    key: 'monthlyByDay',
                    text: 'the',
                    onRenderField: (props, render) => {
                      return (
                        <div  >
                          {render!(props)}
                          <div style={{ display: 'inline-block', verticalAlign: 'top', width: '80px', paddingLeft: '10px' }}>
                            <Dropdown
                              selectedKey={this.state.selectedWeekOrderMonth}
                              onChange={this.onWeekOrderMonthChange}
                              disabled={!this.state.disableDayOfMonth}
                              options={[
                                { key: 'first', text: 'first' },
                                { key: 'Second', text: 'Second' },
                                { key: 'third', text: 'third' },
                                { key: 'fourth', text: 'fourth' },
                                { key: 'last', text: 'last' },

                              ]}
                            />
                          </div>
                          <div style={{ display: 'inline-block', verticalAlign: 'top', width: '100px', paddingLeft: '5px' }}>
                            <Dropdown
                              selectedKey={this.state.selectedWeekDay}
                              disabled={!this.state.disableDayOfMonth}
                              onChange={this.onSelectedWeekDayChange}
                              options={[
                                { key: 'day', text: 'day' },
                                { key: 'weekday', text: 'weekday' },
                                { key: 'weekendday', text: 'weekend day' },
                                { key: 'sunday', text: 'sunday' },
                                { key: 'monday', text: 'monday' },
                                { key: 'tuesday', text: 'tuesday' },
                                { key: 'wednesday', text: 'wednesday' },
                                { key: 'thursday', text: 'thursday' },
                                { key: 'friday', text: 'friday' },
                                { key: 'saturday', text: 'saturday' },
                              ]}
                            />
                          </div>
                          <Label styles={{ root: { display: 'inline-block', verticalAlign: 'top', width: '65px', paddingLeft: '10px' } }}>of every </Label>
                          <MaskedTextField
                            styles={{ root: { display: 'inline-block', verticalAlign: 'top', width: '100px', paddingLeft: '10px' } }}
                            mask="99"
                            maskChar=' '
                            disabled={!this.state.disableDayOfMonth}
                            value={this.state.everyNumberOfMonthsWeekDay}
                            errorMessage={this.state.errorMessageNumberOfMonthWeekDay}
                            onChange={this.onEveryNumberOfMonthsWeekDayChange} />
                          <Label styles={{ root: { display: 'inline-block', verticalAlign: 'top', width: '80px', paddingLeft: '10px' } }}>month(s)</Label>
                        </div>
                      );
                    }

                  }
                ]}
                onChange={this.onPaternChange}
                required={true}
              />
            </div>

            <div style={{ paddingTop: '22px' }}>
              <Label>Date Range</Label>
              <div style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: '35px', paddingTop: '10px' }}>

                <DatePicker
                  firstDayOfWeek={DayOfWeek.Sunday}
                  strings={DayPickerStrings}
                  placeholder="Select a date..."
                  ariaLabel="Select a date"
                  label="Start Date"
                  value={this.state.startDate}
                  onSelectDate={this.onStartDateChange}
                />

              </div>
              <div style={{ display: 'inline-block', verticalAlign: 'top', paddingTop: '10px' }}>
                <ChoiceGroup
                  selectedKey={this.state.selectdateRangeOption}
                  onChange={this.onDataRangeOptionChange}
                  options={[
                    {
                      key: 'noDate',
                      text: 'no end date',
                    },
                    {
                      key: 'endDate',
                      text: strings.EndByLabel,
                      onRenderField: (props, render) => {
                        return (
                          <div  >
                            {render!(props)}
                            <DatePicker
                              firstDayOfWeek={DayOfWeek.Sunday}
                              strings={DayPickerStrings}
                              placeholder="Select a date..."
                              ariaLabel="Select a date"
                              style={{ display: 'inline-block', verticalAlign: 'top', paddingLeft: '22px', }}
                              onSelectDate={this.onEndDateChange}
                              value={this.state.endDate}
                              disabled={this.state.disableEndDate}
                            />
                          </div>
                        );
                      }
                    },
                    {
                      key: 'endAfter',
                      text: strings.EndAfterLabel,
                      onRenderField: (props, render) => {
                        return (
                          <div  >
                            {render!(props)}
                            <MaskedTextField
                              styles={{ root: { display: 'inline-block', verticalAlign: 'top', width: '100px', paddingLeft: '10px' } }}
                              mask="999"
                              maskChar=' '
                              value={this.state.numberOcurrences}
                              disabled={this.state.disableNumberOcurrences}
                              onChange={this.onNumberOfOcurrencesChange} />
                            <Label styles={{ root: { display: 'inline-block', verticalAlign: 'top', paddingLeft: '10px' } }}>Ocurrences</Label>
                          </div>
                        );
                      }
                    },
                  ]}
                  required={true}
                />
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}
