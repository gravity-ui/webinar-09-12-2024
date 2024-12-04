import React from 'react';
import block from 'bem-cn-lite';
import {Moon, Sun} from '@gravity-ui/icons';
import {
    Alert,
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
import type {RealTheme, TextInputProps} from '@gravity-ui/uikit';

import './App.scss';

const b = block('app');
const INPUT_EMAIL = 'email';
const INPUT_PASSWORD = 'password';
const INPUT_PASSWORD_MIN_LENGTH = 8;
const SUBMIT_ACTION_DELAY_MS = 3000;

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

const ValidatedItem: Record<string, {errorMessage: string; validate: (value: string) => boolean}> =
    {
        [INPUT_EMAIL]: {
            validate: (value: string) => {
                return /^\S+@\S+\.\S+$/.test(value);
            },
            errorMessage: 'Incorrect email',
        },
        [INPUT_PASSWORD]: {
            validate: (value: string) => {
                return value.length >= INPUT_PASSWORD_MIN_LENGTH;
            },
            errorMessage: `The password must contain at least ${INPUT_PASSWORD_MIN_LENGTH} characters`,
        },
    } as const;

type ValidatedInputName = typeof INPUT_EMAIL | typeof INPUT_PASSWORD;
type ValidationErrors = Record<ValidatedInputName, string>;
type UseFormInputProps = {
    name: ValidatedInputName;
    validationErrors: ValidationErrors;
    loading: boolean;
    setValidationErrors: (value: ValidationErrors) => void;
};
type FormProps = {
    onSuccsess: () => void;
};

const useFormInput = (props: UseFormInputProps): TextInputProps => {
    const {name, validationErrors, loading, setValidationErrors} = props;

    const handleInputUpdate = () => {
        const hasErrors = Object.values(validationErrors).some(Boolean);

        if (!hasErrors) {
            return;
        }

        const nextValidationErrors = {...validationErrors};
        nextValidationErrors[name] = '';
        setValidationErrors(nextValidationErrors);
    };

    return {
        size: 'xl',
        name,
        placeholder: `${name.charAt(0).toUpperCase()}${name.slice(1)}`,
        validationState: validationErrors[name] ? 'invalid' : undefined,
        errorMessage: validationErrors[name],
        disabled: loading,
        onUpdate: handleInputUpdate,
    };
};

const submitAction = () => {
    return new Promise((resolve) => {
        setTimeout(resolve, SUBMIT_ACTION_DELAY_MS);
    });
};

const Form = ({onSuccsess}: FormProps) => {
    const [validationErrors, setValidationErrors] = React.useState<ValidationErrors>({
        [INPUT_EMAIL]: '',
        [INPUT_PASSWORD]: '',
    });
    const [loading, setLoading] = React.useState(false);
    const emailInputProps = useFormInput({
        name: INPUT_EMAIL,
        validationErrors,
        loading,
        setValidationErrors,
    });
    const passwordInputProps = useFormInput({
        name: INPUT_PASSWORD,
        validationErrors,
        loading,
        setValidationErrors,
    });

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = [...new FormData(e.currentTarget).entries()] as [ValidatedInputName, string][];
        const nextValidationErrors: ValidationErrors = {
            [INPUT_EMAIL]: '',
            [INPUT_PASSWORD]: '',
        };
        data.forEach(([name, value]) => {
            const valid = ValidatedItem[name].validate(value);

            if (!valid) {
                nextValidationErrors[name] = ValidatedItem[name].errorMessage;
            }
        });

        setValidationErrors(nextValidationErrors);

        const hasErrors = Object.values(nextValidationErrors).some(Boolean);

        if (hasErrors) {
            return;
        }

        setLoading(true);
        await submitAction();
        setLoading(false);
        onSuccsess();
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <Flex direction="column" className={b('form-flex')}>
                <Text variant="header-2" className={b('form-title')}>
                    Login
                </Text>
                <TextInput {...emailInputProps} />
                <PasswordInput {...passwordInputProps} hideCopyButton />
                <Button
                    size="xl"
                    view="action"
                    type="submit"
                    className={b('form-submit')}
                    loading={loading}
                >
                    Login
                </Button>
            </Flex>
        </form>
    );
};

const App = () => {
    const [theme, setTheme] = React.useState<RealTheme>('dark');
    const [loggedIn, setLoggedIn] = React.useState(false);

    const handleFormSuccessSubmit = () => setLoggedIn(true);

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
                        {loggedIn ? (
                            <Alert theme="success" title="You've successfully logged in!" />
                        ) : (
                            <Form onSuccsess={handleFormSuccessSubmit} />
                        )}
                    </Col>
                </Row>
            </Container>
        </ThemeProvider>
    );
};

export default App;
