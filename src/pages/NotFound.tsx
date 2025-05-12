import { observer } from 'mobx-react-lite';
import { type FC } from 'react';


export const NotFound: FC<NotFoundProps> = observer((props) => {
    const {  } = props;

    return (
        <div >
            Not Found
        </div>
    );
});

export interface NotFoundProps {
    
}
