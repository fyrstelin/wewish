import React from 'react';
import ReactDOM from 'react-dom';
import color from 'color';

type Props = {
    primary?: string
    secondary?: string
    children?: React.ReactNode
}

const DARK_CONTRAST = '#ffffff';
const DARK_CONTRAST_RGB = '255, 255, 255';

const LIGHT_CONTRAST = '#000000';
const LIGHT_CONTRAST_RGB = '0, 0, 0';

const themeColorElm = document.head.querySelector('meta[name="theme-color"]')! as HTMLMetaElement;

const Style = React.memo(({ primary, secondary }: Props) => {
    const [ style ] = React.useState(() => document.createElement('style'));

    React.useEffect(() => {
        document.head.append(style);
        return () => style.remove();
    }, [style]);

    const p = primary ? color(primary).rgb() : null;
    const s = secondary ? color(secondary).rgb() : null;


    React.useEffect(() => {
        if (!p) { 
            return;
        }
        const old = themeColorElm.content;
        themeColorElm.content = p.hex().toString();
        return () => {
            themeColorElm.content = old;
        };
    }, [p]);
    const css = `
        :root {
            ${
                p ? `
                    --ion-color-primary: ${p.hex()};
                    --ion-color-primary-rgb: ${[p.array()].join(', ')};
                    --ion-color-primary-contrast: ${p.isDark() ? DARK_CONTRAST : LIGHT_CONTRAST};
                    --ion-color-primary-contrast-rgb: ${p.isDark() ? DARK_CONTRAST_RGB : LIGHT_CONTRAST_RGB};
                    --ion-color-primary-shade: ${p.darken(0.3).hex()};
                    --ion-color-primary-tint: ${p.lighten(0.2).hex()};
                ` : ''
            }
            ${
                s ? `
                    --ion-color-secondary: ${s.hex()};
                    --ion-color-secondary-rgb: ${[s.array()].join(', ')};
                    --ion-color-secondary-contrast: ${s.isDark() ? DARK_CONTRAST : LIGHT_CONTRAST};
                    --ion-color-secondary-contrast-rgb: ${s.isDark() ? DARK_CONTRAST_RGB : LIGHT_CONTRAST_RGB};
                    --ion-color-secondary-shade: ${s.darken(0.3).hex()};
                    --ion-color-secondary-tint: ${s.lighten(0.2).hex()};
                ` : ''
            }
        }
    `;

    return ReactDOM.createPortal(
        css,
        style
    );
});

export const ThemeColor = ({ children, primary, secondary }: Props) => {
    return (
        <>
            <Style primary={primary} secondary={secondary}/>
            { children }
        </>
    )
}