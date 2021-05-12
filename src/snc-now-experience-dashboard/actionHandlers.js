import { createHttpEffect } from "@servicenow/ui-effect-http";
import { actionTypes } from "@servicenow/ui-core";

const { COMPONENT_BOOTSTRAPPED } = actionTypes;

import { columns } from "./defaults.js";

export const actionHandlers = {
	[COMPONENT_BOOTSTRAPPED]: (coeffects) => {
		const { dispatch } = coeffects;

		const query = `status=ordered^sys_id=${coeffects.properties.purchaseOrderSysId}`;

		dispatch("FETCH_TASK_DATA", {
			table: "proc_po",
			sysparm_query: query,
			sysparm_display_value: "all",
			sysparm_exclude_reference_link: true,
		});
	},

	FETCH_TASK_DATA: createHttpEffect("api/now/table/:table", {
		pathParams: ["table"],
		queryParams: [
			"sysparm_query",
			"sysparm_display_value",
			"sysparm_exclude_reference_link",
		],
		successActionType: "FETCH_TASK_DATA_SUCCEEDED",
		errorActionType: "FETCH_TASK_DATA_FAILURE",
	}),

	FETCH_TASK_DATA_SUCCEEDED: (coeffects) => {
		const { action, updateState, dispatch } = coeffects;
		const { result } = action.payload;

		let ispopresent = false;

		if (result.length == 1) {
			const query = `status=ordered^purchase_order=${coeffects.properties.purchaseOrderSysId}`;

			dispatch("FETCH_ITEM_DATA", {
				table: "proc_po_item",
				sysparm_query: query,
				sysparm_display_value: "all",
				sysparm_exclude_reference_link: true,
			});

			ispopresent = true;
		} else {
			console.log("Purchase Order not present.");
		}

		updateState({ isPurchaseOrderPresent: ispopresent, showLoading: false });
	},

	FETCH_ITEM_DATA: createHttpEffect("api/now/table/:table", {
		pathParams: ["table"],
		queryParams: [
			"sysparm_query",
			"sysparm_display_value",
			"sysparm_exclude_reference_link",
		],
		successActionType: "FETCH_ITEM_DATA_SUCCEEDED",
		errorActionType: "FETCH_TASK_DATA_FAILURE",
	}),

	FETCH_ITEM_DATA_SUCCEEDED: (coeffects) => {
		const { action, updateState, dispatch } = coeffects;
		const { result } = action.payload;

		const dataRows = result.map((row) => {
			return Object.keys(row).reduce((acc, val) => {
				if (val == "model" || val == "vendor") {
					acc[val] = row[val].display_value;
				}
				if (
					val == "ordered_quantity" ||
					val == "remaining_quantity" ||
					val == "cost" ||
					val == "received" ||
					val == "sys_id" ||
					val == "purchase_order"
				) {
					acc[val] = row[val].value;
				}

				return acc;
			}, {});
		});

		updateState({ dataRows });
	},

	UPDATE_SERVICENOW_RECORD: (coeffects) => {
		const { action, dispatch } = coeffects;
		const { payload } = action;

		console.log("payload", payload.updatedData);

		dispatch("UPDATE_SERVICENOW_RECORDS", {
			data: { "recordData": payload }
		});
	},

	UPDATE_SERVICENOW_RECORDS: createHttpEffect("api/x_ntip_vendor_port/getpurchaseorderdata/purchase_order", {
		method: "POST",
		dataParam: "data",
		successActionType: "UPDATE_ITEM_DATA_SUCCEEDED",
		errorActionType: "UPDATE_TASK_DATA_FAILURE",
	}),

	FETCH_TASK_DATA_FAILURE: () => {
		console.log("Database call Failure.");
	},
};
