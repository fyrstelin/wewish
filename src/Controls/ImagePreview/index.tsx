import React from 'react';
import cx from 'classnames';
import './index.css';

type Props = {
    image: string | undefined
    height: number | '100%'
    className?: string
};

export class ImagePreview extends React.PureComponent<Props> 
{
    render() {
        const { image, height, children, className } = this.props;
        
        const style = image !== undefined
            ? {
                backgroundImage: `url(${image})`
            }
            : {};
        
        return (
            <div className={cx('image-preview', className)} style={{ height }}>
                <div className='blurred' style={style}/>
                <div className='inner' style={style}/>
                {children}
            </div>
        );
    }
}