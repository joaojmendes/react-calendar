import * as React from 'react';
import styles from './EventRecurrenceInfo.module.scss';
import * as strings from 'CalendarWebPartStrings';
import { IEventRecurrenceInfoProps } from './IEventRecurrenceInfoProps';
import { IEventRecurrenceInfoState } from './IEventRecurrenceInfoState';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from 'moment';
import {
  ChoiceGroup,
  IChoiceGroupOption,
  Dropdown,
  IDropdownOption,
  TextField,
  SpinButton,
  Label
} from 'office-ui-fabric-react';
import { Position } from 'office-ui-fabric-react/lib/utilities/positioning';
import { Root } from '@pnp/graph';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';

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

    this._onImageChoiceGroupChange = this._onImageChoiceGroupChange.bind(this);
    this.state = {
      selectedKey: 'day',
    }


  }


  private _onImageChoiceGroupChange(ev: React.SyntheticEvent<HTMLElement>, option: IChoiceGroupOption): void {
    this.setState({
      selectedKey: option.key
    });
  }

  public componentDidMount(): void {

  }

  public render(): React.ReactElement<IEventRecurrenceInfoProps> {



      return(
      <div>


        <div>
          <ChoiceGroup
            label="Pick one icon"
            defaultSelectedKey="day"
            options={[
              {
                key: 'day',
                iconProps: { iconName: 'CalendarDay' },
                text: 'Day'
              },
              {
                key: 'week',
                iconProps: { iconName: 'CalendarWeek' },
                text: 'Week'
              },
              {
                key: 'month',
                iconProps: { iconName: 'Calendar' },
                text: 'Month',

              },
              {
                key: 'year',
                iconProps: { iconName: 'Calendar' },
                text: 'Month',
              }
            ]}
            onChange={this._onImageChoiceGroupChange}

          />
        </div>
        {
          this.state.selectedKey === 'day' && (
            <div style={{ width: '100%', paddingTop: '10px' }}>
              <Label>Patern</Label>
              <ChoiceGroup
                defaultSelectedKey="A"
                options={[
                  {
                    key: 'A',
                    text: 'every',
                    ariaLabel: 'every',

                    onRenderField: (props, render) => {
                      return (
                        <div  >
                          {render!(props)}
                          <SpinButton
                            min={1}
                            max={1300}
                            defaultValue="1"
                            labelPosition={Position.end}
                            step={1}
                            label={'days'}
                            styles={{ root: { display: 'inline-block', verticalAlign: 'top', width: '150px', paddingLeft: '10px' } }}
                          />
                        </div>
                      );
                    }
                  },
                  {
                    key: 'B',
                    text: 'every weekdays',
                  }
                ]}
                onChange={(ev, opt) => {
                  ev.preventDefault();
                  console.log(opt.key);
                }}
                required={true}
              />
            </div>
          )
        }
        <div style={{ paddingTop: '22px' }}>
          <Label>Date Range</Label>
          <div style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: '35px', paddingTop: '15px' }}>

            <DatePicker firstDayOfWeek={DayOfWeek.Sunday} strings={DayPickerStrings} placeholder="Select a date..." ariaLabel="Select a date" label="Start Date" />

          </div>
          <div style={{ display: 'inline-block', verticalAlign: 'top', paddingTop: '12px'}}>
            <ChoiceGroup

              defaultSelectedKey="B"
              options={[
                {
                  key: 'A',
                  text: 'no end date',
                },

                {
                  key: 'C',
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
                          style={{ display: 'inline-block', verticalAlign: 'top', paddingLeft: '22px',  }}
                        />
                      </div>
                    );
                  }
                },
                {
                  key: 'B',
                  text: strings.EndAfterLabel,
                  onRenderField: (props, render) => {
                    return (
                      <div  >
                        {render!(props)}
                        <SpinButton
                          min={1}
                          max={1300}
                          defaultValue="1"
                          labelPosition={Position.end}
                          step={1}
                          label={'ocurrences'}
                          styles={{ root: { display: 'inline-block', verticalAlign: 'top', width: '200px', paddingLeft: '10px', } }}
                        />
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
    );
  }


}
