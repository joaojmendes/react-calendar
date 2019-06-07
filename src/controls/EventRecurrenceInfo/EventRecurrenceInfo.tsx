import * as React from 'react';
import styles from './EventRecurrenceInfo.module.scss';
import * as strings from 'CalendarWebPartStrings';
import { IEventRecurrenceInfoProps } from './IEventRecurrenceInfoProps';
import { IEventRecurrenceInfoState } from './IEventRecurrenceInfoState';
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
  MaskedTextField
} from 'office-ui-fabric-react';
import { Position } from 'office-ui-fabric-react/lib/utilities/positioning';
import { Root } from '@pnp/graph';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import { _MinimalWebPartContainer } from '@microsoft/sp-webpart-base';
import { EventRecurrenceInfoDaily } from './../EventRecurrenceInfoDaily/EventRecurrenceInfoDaily';
import { EventRecurrenceInfoWeekly } from './../EventRecurrenceInfoWeekly/EventRecurrenceInfoWeekly';
import { EventRecurrenceInfoMonthly } from './../EventRecurrenceInfoMonthly/EventRecurrenceInfoMonthly';
import { EventRecurrenceInfoYearly } from './../EventRecurrenceInfoYearly/EventRecurrenceInfoYearly';


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

export class EventRecurrenceInfo extends React.Component<IEventRecurrenceInfoProps, IEventRecurrenceInfoState> {

  public constructor(props) {
    super(props);

    this._onRecurrenceFrequenceChange = this._onRecurrenceFrequenceChange.bind(this);

    this.state = {
      selectedKey: 'daily',
      selectPatern: 'every',
      startDate: moment().toDate(),
      endDate: moment().endOf('month').toDate(),
      numberOcurrences: '1',
      numberOfDays: '1',
      disableNumberOfDays: false,
      disableNumberOcurrences: true,
      selectdateRangeOption: 'noDate',
      disableEndDate: true,
      selectedRecurrenceRule: 'daily',

    };
  }



  private _onRecurrenceFrequenceChange(ev: React.SyntheticEvent<HTMLElement>, option: IChoiceGroupOption): void {
    this.setState({
      selectedRecurrenceRule: option.key
    });
  }


  /**
   *
   *
   * @memberof EventRecurrenceInfo
   */
  public async componentDidMount() {
    if (this.props.recurrenceData) {
      if (this.props.recurrenceData.indexOf('<daily') != -1) {
        this.setState({ selectedRecurrenceRule: 'daily' });
      }
      if (this.props.recurrenceData.indexOf('<weekly') != -1) {
        this.setState({ selectedRecurrenceRule: 'weekly' });
      }
      if (this.props.recurrenceData.indexOf('<monthly') != -1) {
        this.setState({ selectedRecurrenceRule: 'monthly' });
      }
      if (this.props.recurrenceData.indexOf('<monthlyByDay') != -1) {
        this.setState({ selectedRecurrenceRule: 'monthly' });
      }
      if (this.props.recurrenceData.indexOf('<yearly') != -1) {
        this.setState({ selectedRecurrenceRule: 'yearly' });
      }
    }
  }

  /**
   *
   *
   * @returns {React.ReactElement<IEventRecurrenceInfoProps>}
   * @memberof EventRecurrenceInfo
   */
  public render(): React.ReactElement<IEventRecurrenceInfoProps> {
    return (
      <div className={styles.divWrraper} >

        <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
          <ChoiceGroup
            label="Recurrence Information"
            selectedKey={this.state.selectedRecurrenceRule}
            options={[
              {
                key: 'daily',
                iconProps: { iconName: 'CalendarDay' },
                text: 'Daily'
              },
              {
                key: 'weekly',
                iconProps: { iconName: 'CalendarWeek' },
                text: 'Weekly'
              },
              {
                key: 'monthly',
                iconProps: { iconName: 'Calendar' },
                text: 'Monthly',

              },
              {
                key: 'yearly',
                iconProps: { iconName: 'Calendar' },
                text: 'yearly',
              }
            ]}
            onChange={this._onRecurrenceFrequenceChange}
          />
        </div>
        {
          this.state.selectedRecurrenceRule === 'daily' && (
            <EventRecurrenceInfoDaily
              display={true}
              recurrenceData={this.props.recurrenceData}
              startDate={this.props.startDate}
              context={this.props.context}
              siteUrl={this.props.siteUrl}
              returnRecurrenceData={this.props.returnRecurrenceData}
            />
          )
        }
        {
          this.state.selectedRecurrenceRule === 'weekly' && (
            <EventRecurrenceInfoWeekly
              display={true}
              recurrenceData={this.props.recurrenceData}
              startDate={this.props.startDate}
              context={this.props.context}
              siteUrl={this.props.siteUrl}
              returnRecurrenceData={this.props.returnRecurrenceData}
            />
          )
        }
        {
          this.state.selectedRecurrenceRule === 'monthly' && (
            <EventRecurrenceInfoMonthly
              display={true}
              recurrenceData={this.props.recurrenceData}
              startDate={this.props.startDate}
              context={this.props.context}
              siteUrl={this.props.siteUrl}
              returnRecurrenceData={this.props.returnRecurrenceData}
            />
          )
        }
         {
          this.state.selectedRecurrenceRule === 'yearly' && (
            <EventRecurrenceInfoYearly
              display={true}
              recurrenceData={this.props.recurrenceData}
              startDate={this.props.startDate}
              context={this.props.context}
              siteUrl={this.props.siteUrl}
              returnRecurrenceData={this.props.returnRecurrenceData}
            />
          )
        }
      </div>
    );
  }
}
