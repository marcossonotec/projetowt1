import React, { useContext, useState, useEffect } from "react";
import openSocket from "socket.io-client";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Select from "@material-ui/core/Select";
import { toast } from "react-toastify";

import api from "../../services/api";
import { i18n } from "../../translate/i18n.js";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";

const oneTab = require('../../assets/onetab.jpg');
const twoTab = require('../../assets/twotab.jpg');

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(4),
	},

	paper: {
		padding: theme.spacing(2),
		display: "flex",
		alignItems: "center",
	},

	settingOption: {
		marginLeft: "auto",
	},
	margin: {
		margin: theme.spacing(1),
	},
	
	mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
}));

const Settings = () => {
	const classes = useStyles();
	const { user } = useContext(AuthContext);
	const [settings, setSettings] = useState([]);
	const [settingsUser, setSettingsUser] = useState(user.modeTabTickets);
	
	const userId = user.id;	

	useEffect(() => {
		const fetchSession = async () => {
			try {
				const { data } = await api.get("/settings");
				setSettings(data);
			} catch (err) {
				toastError(err);
			}
		};
		fetchSession();
		
	}, []);
	
	useEffect(() => {
		const socket = openSocket(process.env.REACT_APP_BACKEND_URL);

		socket.on("settings", data => {
			if (data.action === "update") {
				setSettings(prevState => {
					const aux = [...prevState];
					const settingIndex = aux.findIndex(s => s.key === data.setting.key);
					aux[settingIndex].value = data.setting.value;
					return aux;
				});
			}
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	const handleChangeSetting = async e => {
		const selectedValue = e.target.value;
		const settingKey = e.target.name;

		try {
			await api.put(`/settings/${settingKey}`, {
				value: selectedValue,
			});
			toast.success(i18n.t("settings.success"));
		} catch (err) {
			toastError(err);
		}
	};
	
	const handleChangeTicketList = async e => {
		setSettingsUser(e.target.value);
		const userData = { modeTabTickets: e.target.value };
		try {
			await api.put(`/users/${userId}`, userData);
			toast.success("Informa????o Salva");
		} catch (err) {
			toastError(err);
		}
	};
	

	const getSettingValue = key => {
		const { value } = settings.find(s => s.key === key);
		return value;
	};

	return (
		<div className={classes.root}>
			<Container className={classes.container} maxWidth="sm">
				<Typography variant="body2" gutterBottom>
					{i18n.t("settings.title")}
				</Typography>
				<Paper className={classes.paper}>
					<Typography variant="body1">
						{i18n.t("settings.settings.userCreation.name")}
					</Typography>
					<Select
						margin="dense"
						variant="outlined"
						native
						id="userCreation-setting"
						name="userCreation"
						value={
							settings && settings.length > 0 && getSettingValue("userCreation")
						}
						className={classes.settingOption}
						onChange={handleChangeSetting}
					>
						<option value="enabled">
							{i18n.t("settings.settings.userCreation.options.enabled")}
						</option>
						<option value="disabled">
							{i18n.t("settings.settings.userCreation.options.disabled")}
						</option>
					</Select>
				</Paper>
				<Paper className={classes.paper}>
					<Typography variant="body1">
						{i18n.t("settings.settings.CheckMsgIsGroup.name")}
					</Typography>
					<Select
						margin="dense"
						variant="outlined"
						native
						id="CheckMsgIsGroup-setting"
						name="CheckMsgIsGroup"
						value={
							settings && settings.length > 0 && getSettingValue("CheckMsgIsGroup")
						}
						className={classes.settingOption}
						onChange={handleChangeSetting}
					>
						<option value="enabled">
							{i18n.t("settings.settings.CheckMsgIsGroup.options.enabled")}
						</option>
						<option value="disabled">
							{i18n.t("settings.settings.CheckMsgIsGroup.options.disabled")}
						</option>
					</Select>
				</Paper>
				  <Paper className={classes.mainPaper} variant="outlined">
					<Typography variant="h6">
						{i18n.t("Modo de Exibi????o dos Tickets")}
					</Typography>
					<Typography component="div">
						<label>
							<input
								type="radio"
								name="site_name" 
								value="oneTab"
								onChange={handleChangeTicketList}
								checked={settingsUser === "oneTab"}
							/> 
							<img src={oneTab} width="170" height="170"/>
						</label>
						<label>
							<input
								type="radio"
								name="site_name" 
								value="twoTab"
								onChange={handleChangeTicketList}
								checked={settingsUser === "twoTab"}
							/> 
							<img src={twoTab} width="170" height="170"/>
						</label>
					  </Typography>
					
				</Paper>
				
			</Container>
		</div>
	);
};

export default Settings;
