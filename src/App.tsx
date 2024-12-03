import React from 'react';
import block from 'bem-cn-lite';
import {Moon, Sun} from '@gravity-ui/icons';
import {Button, Container, Icon, ThemeProvider, useTheme} from '@gravity-ui/uikit';
import type {RealTheme} from '@gravity-ui/uikit';

import './App.scss';

const b = block('app');

const ThemeButton = ({onClick}: {onClick: (value: RealTheme) => void}) => {
    const theme = useTheme();

    return (
        <Button
            size="l"
            view="raised"
            onClick={() => {
                const nextTheme: RealTheme = theme === 'dark' ? 'light' : 'dark';
                onClick(nextTheme);
            }}
            className={b('theme-button')}
        >
            <Icon data={theme === 'dark' ? Sun : Moon} />
        </Button>
    );
};

const App = () => {
    const [theme, setTheme] = React.useState<RealTheme>('dark');

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="m" className={b('container')}>
                <ThemeButton onClick={setTheme} />
            </Container>
        </ThemeProvider>
    );
};

export default App;
