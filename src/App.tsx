import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Label,
  FormGroup,
  FormFeedback,
} from 'reactstrap';
import { xor } from 'lodash';
import axios from 'axios';
import {
  Input,
  Dropdown,
  Checkbox,
  Button,
} from './components';
import type { DropdownOption } from './components';
import './App.scss';

interface LooseObject {
  [key: string]: any,
}

type FormParams = LooseObject | {
  firstName: string,
  lastName: string,
  email: string,
  org: string,
  euResident: string,
  fieldName: string[],
};

type ItemError = {
  title: string,
  type: string,
  error: string,
};

type FormErrors = LooseObject | {
  firstName: ItemError,
  lastName: ItemError,
  email: ItemError,
  euResident: ItemError,
  fieldName: ItemError,
};

type SubmitStatus = {
  status: string,
  message: string,
};

const initialValues: FormParams = {
  firstName: '',
  lastName: '',
  email: '',
  org: '',
  euResident: '',
  fieldName: [],
};

const initialErrors: FormErrors = {
  firstName: {
    title: 'First name',
    type: 'text',
    error: '',
  },
  lastName: {
    title: 'Last name',
    type: 'text',
    error: '',
  },
  email: {
    title: 'Email Address',
    type: 'email',
    error: '',
  },
  euResident: {
    title: 'EU Resident',
    type: 'text',
    error: '',
  },
  fieldName: {
    title: 'More than one checkbox selected',
    type: 'checkbox',
    error: '',
  },
};

const residentItems: DropdownOption[] = [{
  text: '- Select one -',
  value: '',
  placeholder: true,
}, {
  text: 'Yes',
  value: 'yes',
}, {
  text: 'No',
  value: 'no',
}];

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default () => {
  const [formItems, setFormItems]: [FormParams, Function] = useState(initialValues);
  const [formErrors, setFormErrors]: [FormErrors, Function] = useState(initialErrors);
  const [submitStatus, setSubmitStatus]: [SubmitStatus | undefined, Function] = useState();
  const [submitTried, setSubmitTried] = useState(false);

  const validate = useCallback((items: FormParams, reset?: boolean) => {
    const currentErrors = { ...formErrors };
    (Object.keys(currentErrors) as Array<keyof FormErrors>).forEach((name) => {
      if (reset) {
        currentErrors[name].error = '';
      } else {
        switch (currentErrors[name].type) {
          case 'checkbox':
            if (!items[name].length) {
              currentErrors[name].error = `${currentErrors[name].title} is required`;
            } else {
              currentErrors[name].error = '';
            }
            break;
          case 'email':
            if (!items[name]) {
              currentErrors[name].error = `${currentErrors[name].title} is required`;
            } else if (!emailRegex.test(items[name])) {
              currentErrors[name].error = `${currentErrors[name].title} is invalid`;
            } else {
              currentErrors[name].error = '';
            }
            break;
          default:
            if (!items[name]) {
              currentErrors[name].error = `${currentErrors[name].title} is required`;
            } else {
              currentErrors[name].error = '';
            }
            break;
        }
      }
    });
    setFormErrors(currentErrors);
    return Object.values(currentErrors).every(({ error }) => !error);
  }, [formErrors]);

  useEffect(() => {
    if (submitTried) {
      validate(formItems);
      setSubmitStatus();
    }
  }, [formItems, submitTried]);

  const onChange = useCallback((e: any) => {
    const {
      currentTarget: { name, value, type },
    } : {
      currentTarget: { name: keyof FormParams, value: string, type: string },
    } = e;
    setFormItems((f: FormParams) => ({
      ...f,
      [name]: type === 'checkbox' ? xor(f[name] as string[], [value]) : value,
    }));
  }, []);

  const onSelect = useCallback((value: string) => {
    setFormItems((f: FormParams) => ({
      ...f,
      euResident: value,
    }));
  }, []);

  const onReset = useCallback((e: any) => {
    e.preventDefault();
    setFormItems(initialValues);
    validate(formItems, true);
    setSubmitTried(false);
    setSubmitStatus();
  }, []);

  const onSubmit = useCallback(async (e: any) => {
    e.preventDefault();
    if (validate(formItems)) {
      try {
        const { data } = await axios({
          method: 'post',
          url: 'http://localhost:3001/submit-form',
          data: formItems,
        });
        setSubmitStatus(data);
      } catch (error) {
        setSubmitStatus({
          status: 'error',
          message: error.message,
        });
      }
    } else {
      setSubmitTried(true);
    }
  }, [formItems]);

  const {
    firstName,
    lastName,
    email,
    org,
    euResident,
    fieldName,
  } = formItems;

  return (
    <Container className="Form">
      {(submitStatus !== undefined && submitStatus.status !== 'error') ? (
        <Row>
          <Col>
            <h3>{submitStatus.message}</h3>
          </Col>
        </Row>
      ) : (
        <Form>
          <Row>
            <Col>
              <FormGroup>
                {formErrors.firstName.error && (
                  <FormFeedback>
                    {formErrors.firstName.error}
                  </FormFeedback>
                )}
                <Label for="firstName">First Name*</Label>
                <Input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={firstName}
                  error={formErrors.firstName.error}
                  onChange={onChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                {formErrors.lastName.error && (
                  <FormFeedback>
                    {formErrors.lastName.error}
                  </FormFeedback>
                )}
                <Label for="lastName">Last Name*</Label>
                <Input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={lastName}
                  error={formErrors.lastName.error}
                  onChange={onChange}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                {formErrors.email.error && (
                  <FormFeedback>
                    {formErrors.email.error}
                  </FormFeedback>
                )}
                <Label for="email">Email Address*</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  error={formErrors.email.error}
                  onChange={onChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label for="org">Organization</Label>
                <Input
                  id="org"
                  type="text"
                  name="org"
                  value={org}
                  onChange={onChange}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                {formErrors.euResident.error && (
                  <FormFeedback>
                    {formErrors.euResident.error}
                  </FormFeedback>
                )}
                <Label for="euResident">
                  EU Resident*
                  <Dropdown
                    id="euResident"
                    name="euResident"
                    items={residentItems}
                    selected={euResident}
                    error={formErrors.euResident.error}
                    onSelect={onSelect}
                    required
                  />
                </Label>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                {formErrors.fieldName.error && (
                  <FormFeedback>
                    {formErrors.fieldName.error}
                  </FormFeedback>
                )}
                <Label for="advances">
                  <Checkbox
                    id="advances"
                    name="fieldName"
                    value="advances"
                    checked={fieldName.includes('advances')}
                    error={formErrors.fieldName.error}
                    onChange={onChange}
                    required
                  />
                  Advances
                </Label>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label for="alerts">
                  <Checkbox
                    id="alerts"
                    name="fieldName"
                    value="alerts"
                    checked={fieldName.includes('alerts')}
                    error={formErrors.fieldName}
                    onChange={onChange}
                  />
                  Alerts
                </Label>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <Label for="other">
                  <Checkbox
                    id="other"
                    name="fieldName"
                    value="other"
                    checked={fieldName.includes('other')}
                    error={formErrors.fieldName}
                    onChange={onChange}
                  />
                  Other communication
                </Label>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              {submitStatus !== undefined && submitStatus.status === 'error' && (
                <FormFeedback>
                  Error:&nbsp;
                  {submitStatus.message}
                </FormFeedback>
              )}
              <Button type="submit" onClick={onSubmit}>Submit</Button>
              <Button type="reset" onClick={onReset}>Reset</Button>
            </Col>
          </Row>
        </Form>
      )}
    </Container>
  );
};
