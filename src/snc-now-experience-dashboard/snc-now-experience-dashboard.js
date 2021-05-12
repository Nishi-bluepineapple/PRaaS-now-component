import { createCustomElement, actionTypes } from "@servicenow/ui-core";
const { COMPONENT_BOOTSTRAPPED } = actionTypes;

import { createHttpEffect } from "@servicenow/ui-effect-http";

import "../components/now-experience-table";

import styles from "./styles.scss";

import { columns, taskTables } from "./defaults.js";
import { actionHandlers } from "./actionHandlers";

const view = (state, { helpers }) => {
	const { isPurchaseOrderPresent, showLoading, dataRows } = state;

	const displayColumns = columns.filter((col) => {
		return col.field !== "sys_id";
	});

	return (
		<div className="container">
			<div className="table-content"></div>
				<now-experience-table
					title="Task table"
					isPurchaseOrderPresent={isPurchaseOrderPresent}
					showLoading={showLoading}
					//dataColumns={displayColumns}
					dataRows={dataRows}
				></now-experience-table>
		</div>
	);
};

createCustomElement("snc-now-experience-dashboard", {
	view,
	properties: {
		purchaseOrderSysId: {
			default: "28da5bc91b043010dbbc437cbc4bcb70",
		},
	},

	actionHandlers: {
		...actionHandlers,
	},

	styles,
});
