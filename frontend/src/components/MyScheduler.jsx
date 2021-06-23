/* eslint-disable jsx-a11y/anchor-is-valid */
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  AppointmentForm,
  Appointments,
  AppointmentTooltip,
  DateNavigator,
  DayView,
  MonthView,
  Resources,
  Scheduler,
  TodayButton,
  Toolbar,
  ViewSwitcher,
  WeekView,
} from "@devexpress/dx-react-scheduler-material-ui";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AccessTime from "@material-ui/icons/AccessTime";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import Lens from "@material-ui/icons/Lens";
import Room from "@material-ui/icons/Room";
import classNames from "clsx";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";
import { setScheduleCompleted } from "../actions/user";
import { USER_SET_SCHEDULE_COMPLETED_RESET } from "../constants/user";

const completed = [
  {
    id: true,
    color: "#196934",
  },
  {
    id: false,
    color: "#23c85c",
  },
];

const resources = [
  {
    fieldName: "isCompleted",
    title: "Completed",
    instances: completed,
  },
];

const useStyles = makeStyles(() => ({
  appointment: {
    backgroundColor: ({ color }) => color,
    borderRadius: "10px",
    "&:hover": {
      opacity: 0.6,
    },
  },
  appointmentContent: {
    "&>div>div": {
      whiteSpace: "normal !important",
      lineHeight: 1.2,
    },
  },
}));

const useHeaderStyle = ({ palette }) => ({
  icon: {
    color: palette.action.active,
  },
  textCenter: {
    textAlign: "center",
  },
  header: {
    height: "260px",
    backgroundSize: "cover",
  },
  commandButton: {
    backgroundColor: "rgba(255,255,255,0.65)",
  },
});

const useTooltipContentStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(3, 1),
    paddingTop: 0,
    backgroundColor: theme.palette.background.paper,
    boxSizing: "border-box",
    width: "400px",
  },
  contentContainer: {
    paddingBottom: theme.spacing(1.5),
  },
  text: {
    ...theme.typography.body2,
    display: "inline-block",
  },
  title: {
    ...theme.typography.h6,
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightBold,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "normal",
  },
  icon: {
    verticalAlign: "middle",
  },
  contentItemIcon: {
    textAlign: "center",
  },
  grayIcon: {
    color: theme.palette.action.active,
  },
  colorfulContent: {
    color: ({ color }) => color,
  },
  lens: {
    width: theme.spacing(4.5),
    height: theme.spacing(4.5),
    verticalAlign: "super",
  },
  textCenter: {
    textAlign: "center",
  },
  dateAndTitle: {
    lineHeight: 1.1,
  },
  titleContainer: {
    paddingBottom: theme.spacing(2),
  },
  container: {
    paddingBottom: theme.spacing(1.5),
  },
}));

const Appointment = withStyles(useStyles, { name: "Appointment" })(({ classes, ...restProps }) => (
  <Appointments.Appointment {...restProps} className={classes.appointment} />
));

const AppointmentContent = withStyles(useStyles, { name: "AppointmentContent" })(({ classes, ...restProps }) => (
  <Appointments.AppointmentContent {...restProps} className={classes.appointmentContent} />
));

const TooltipHeader = withStyles(useHeaderStyle, { name: "Header" })(
  ({ children, appointmentData, classes, ...restProps }) => {
    const dispatch = useDispatch();

    const loggedInUser = useSelector((state) => state.loggedInUser);
    const { userDetails } = loggedInUser;
    const setScheduleCompletedStatus = useSelector((state) => state.setScheduleCompletedStatus);
    const { success } = setScheduleCompletedStatus;

    useEffect(() => {
      if (success) {
        dispatch({ type: USER_SET_SCHEDULE_COMPLETED_RESET });
      }
    }, [dispatch, success]);

    return !appointmentData.isCompleted ? (
      <AppointmentTooltip.Header {...restProps} appointmentData={appointmentData}>
        <a data-tip data-for="setCompletedTooltip">
          <IconButton
            onClick={() => {
              dispatch(setScheduleCompleted(userDetails._id, appointmentData.id));
              appointmentData.isCompleted = !appointmentData.isCompleted;
            }}
            className={classes.commandButton}
          >
            <DoneOutlineIcon />
          </IconButton>
        </a>
        <ReactTooltip id="setCompletedTooltip" effect="solid" place="top">
          <span className="tooltip-span">set schedule to completed status</span>
        </ReactTooltip>
      </AppointmentTooltip.Header>
    ) : (
      <div className="completed-container">
        <img alt="completed schedule" src={process.env.REACT_APP_FILE_UPLOAD_PATH + "completed-icon.png"} />
      </div>
    );
  }
);

const TooltipContent = ({ appointmentData, formatDate }) => {
  const classes = useTooltipContentStyles({ color: appointmentData.isCompleted ? "#196934" : "#23c85c" });

  const sameDay = (d1, d2) => {
    d1 = new Date(d1);
    d2 = new Date(d2);
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  };

  return (
    <div className={classes.content}>
      <Grid container alignItems="flex-start" className={classes.titleContainer}>
        <Grid item xs={2} className={classNames(classes.textCenter)}>
          <Lens className={classNames(classes.lens, classes.colorfulContent)} />
        </Grid>
        <Grid item xs={10}>
          <div>
            <div className={classNames(classes.title, classes.dateAndTitle)}>{appointmentData.tooltipTitle}</div>
            <div className={classNames(classes.text, classes.dateAndTitle)}>
              {sameDay(appointmentData.startDate, appointmentData.endDate)
                ? formatDate(appointmentData.startDate, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : `${formatDate(appointmentData.startDate, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              - ${formatDate(appointmentData.endDate, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}`}
            </div>
          </div>
        </Grid>
      </Grid>
      <Grid container alignItems="center" className={classes.contentContainer}>
        <Grid item xs={2} className={classes.textCenter}>
          <AccessTime className={classes.icon} />
        </Grid>
        <Grid item xs={10}>
          <div className={classes.text}>
            {`${formatDate(appointmentData.startDate, { hour: "numeric", minute: "numeric" })}
              - ${formatDate(appointmentData.endDate, { hour: "numeric", minute: "numeric" })}`}
          </div>
        </Grid>
      </Grid>
      <Grid container alignItems="center">
        <Grid item xs={2} className={classes.textCenter}>
          <Room className={classes.icon} />
        </Grid>
        <Grid item xs={10}>
          <span>{appointmentData.executionAddress}</span>
        </Grid>
      </Grid>
    </div>
  );
};

const MyScheduler = () => {
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const { userDetails } = loggedInUser;

  const events = userDetails.schedules.map((schedule) => {
    return {
      id: schedule._id,
      title: schedule.title + " - " + schedule.executionAddress,
      tooltipTitle: schedule.title,
      executionAddress: schedule.executionAddress,
      startDate: schedule.availabilityPeriod.startTime,
      endDate: schedule.availabilityPeriod.endTime,
      isCompleted: schedule.completed,
    };
  });

  return (
    <>
      <h1>Your Scheduler</h1>
      <hr></hr>
      <br></br>
      <Paper>
        <Scheduler data={events} height={600}>
          <ViewState defaultCurrentDate={Date.now()} defaultCurrentViewName="Week" />

          <DayView />
          <WeekView />
          <MonthView />

          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <ViewSwitcher />

          <Appointments appointmentComponent={Appointment} appointmentContentComponent={AppointmentContent} />
          <AppointmentTooltip headerComponent={TooltipHeader} contentComponent={TooltipContent} showCloseButton />
          <AppointmentForm readOnly />

          <Resources data={resources} />
        </Scheduler>
      </Paper>
    </>
  );
};

export default MyScheduler;
