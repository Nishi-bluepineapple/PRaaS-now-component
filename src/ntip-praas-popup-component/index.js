import {createCustomElement} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';

import '../snc-now-experience-dashboard';

const view = (state, {updateState}) => {
    return (
        <snc-now-experience-dashboard/>
    );
};
createCustomElement("ntip-praas-popup-component", {
	renderer: { type: snabbdom },
	view,
	actionHandlers: {
		
	},

	styles,
});
