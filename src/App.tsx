import React from 'react';
import block from 'bem-cn-lite';
import {Moon, Sun} from '@gravity-ui/icons';
import {
    Button,
    Col,
    Container,
    Flex,
    Icon,
    PasswordInput,
    Row,
    Text,
    TextInput,
    ThemeProvider,
    useTheme,
} from '@gravity-ui/uikit';
import type {RealTheme} from '@gravity-ui/uikit';

import './App.scss';

const b = block('app');
const INPUT_EMAIL = 'email';
const INPUT_PASSWORD = 'password';

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

const Form = () => {
    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
            }}
        >
            <Flex direction="column" className={b('form-flex')}>
                <Text variant="header-2" className={b('form-title')}>
                    Login
                </Text>
                <TextInput size="xl" name={INPUT_EMAIL} placeholder="Email" />
                <PasswordInput
                    size="xl"
                    name={INPUT_PASSWORD}
                    placeholder="Password"
                    hideCopyButton
                />
                <Button size="xl" view="action" type="submit" className={b('form-submit')}>
                    Login
                </Button>
            </Flex>
        </form>
    );
};

const App = () => {
    const [theme, setTheme] = React.useState<RealTheme>('dark');

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="m" className={b('container')}>
                <ThemeButton onClick={setTheme} />
                <Row space={5} className={b('container-row')}>
                    <Col m={6} s={12}>
                        <div className={b('logo', {dark: theme === 'dark'})} />
                    </Col>
                </Row>
                <Row space={5} className={b('container-row')}>
                    <Col m={6} s={12}>
                        <Form />
                    </Col>
                </Row>
            </Container>
        </ThemeProvider>
    );
};

export default App;
