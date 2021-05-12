import { createCustomElement } from "@servicenow/ui-core";
import "@servicenow/now-loader";
import "@servicenow/now-card";
import "@servicenow/now-button";
import styles from "./table-styles.scss";
import image from "./computer_image.png";

createCustomElement("now-experience-table", {
	view: (state, helpers) => {
		const { dispatch } = helpers;
		const { isPurchaseOrderPresent, showLoading, dataRows } = state.properties;
		const { data } = state;

		return (
			<div className="table-container">
				{showLoading ? (
					<now-loader />
				) : (
					<div>
						{isPurchaseOrderPresent ? (
							<fragment>
								{" "}
								<div className="submitbutton">
									<now-button
										label="Submit"
										variant="secondary"
										append-to-payload={{ type: "submit" }}
										tooltipContent="Submit Purchase Line Item"
									></now-button>
								</div>
								<div className="poitemcards">
									<div className="container-fluid">
										{dataRows.map((row, index) => {
											row.received = 0;
											return (
												<div className="table-container">
													<now-card>
														<table>
															<tr>
																<th></th>
																<th>Remaining Quantity </th>
																<th>Unit Cost</th>
																<th>Receiving Quantity</th>
															</tr>
															<tr>
																<td className="fixHeight">
																	<td>
																		<span className="item-image">
																			<img src={image} />
																		</span>
																	</td>
																	<td className="alignLeft">
																		<tr>
																			<span className="req-item-label">
																				{row.model}
																			</span>
																		</tr>
																		<tr>
																			<span className="req-item-more-details">
																				{row.vendor}
																			</span>
																		</tr>
																		<tr>
																			<span className="req-item-more-details">
																				Total Requested{" "}
																				<b>{row.ordered_quantity}</b>
																			</span>
																		</tr>
																	</td>
																</td>
																<td>
																	<input
																		type="number"
																		value={row.remaining_quantity}
																		readonly
																	></input>
																</td>
																<td>
																	<input
																		value={row.cost}
																		type="number"
																		on-input={(e) =>
																			(row.cost = e.target.value)
																		}
																		required
																	/>
																</td>
																<td>
																	<input
																		type="number"
																		on-input={(e) => {
																			row.received = e.target.value;
																		}}
																		required
																	/>
																</td>
															</tr>
														</table>
													</now-card>
												</div>
											);
										})}
									</div>
								</div>
							</fragment>
						) : (
							<now-card>
								<h2>This purchase order is not in Ordered status.</h2>
							</now-card>
						)}
					</div>
				)}
			</div>
		);
	},

	actionHandlers: {
		"NOW_BUTTON#CLICKED": ({ action, dispatch, state, updateState }) => {
			const { type } = action.payload;
			const { dataRows } = state.properties;

			let result = dataRows.filter(function (row) {
				return row.received > 0;
			});

			dispatch("UPDATE_SERVICENOW_RECORD", {
				updatedData: result,
			});
		},
	},
	initialState: {
		data: "",
	},
	properties: {
		dataColumns: {
			default: [],
		},
		dataRows: {
			default: [],
		},
		isPurchaseOrderPresent: {
			default: false,
		},
		showLoading: {
			default: true,
		},
	},
	styles,
});
