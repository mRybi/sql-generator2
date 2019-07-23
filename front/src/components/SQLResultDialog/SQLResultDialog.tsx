import './SQLResultDialog.scss';
import * as React from "react";
import { AxiosResponse } from 'axios';
import sqlFormatter from "sql-formatter";

class OwnProps {
    sqlStringResponse: AxiosResponse;
}

class State {
    sqlString: {};
}

type Props = OwnProps;

class SQLResultDialog extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    componentWillReceiveProps(newProps: Props) {
        if (this.props.sqlStringResponse !== newProps.sqlStringResponse) {
            this.setState({
                sqlString: newProps.sqlStringResponse
            });
        }
    }

    render() {
        if (this.props.sqlStringResponse === null) return 'Loading...';
        return (
            <div className="SQLResultDialog">
                <textarea readOnly={true} value={sqlFormatter.format(this.props.sqlStringResponse.data, {
                    language: "sql", // Defaults to "sql"
                    indent: "    "   // Defaults to two spaces
                })}/>
            </div>);
    }

}

export default SQLResultDialog;