import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Row, Col, Card, Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SchemaField from './SchemaField';

const SchemaBuilder = () => {
  const formMethods = useForm({
    defaultValues: { schema: [] },
    mode: 'onChange',
  });

  const { control, handleSubmit, watch, register } = formMethods;

  const { fields, append,remove } = useFieldArray({
    control,
    name: 'schema',
  });

  const schemaValues = watch('schema');

  const handleAddField = () => {
    append({ key: '', type: undefined, required: false });
  };

  const onSubmit = (formData) => {
    console.log('Submitted:', formData);
  };

  const renderJSON = (data) => {
    const output = {};

    for (const field of data || []) {
      const { key, type, children ,required} = field;
      if (!key) continue;

      switch (type) {
        case 'string':
          output[key] = 'STRING';
          break;
        case 'number':
          output[key] = 'NUMBER';
          break;
        case 'float':
          output[key] = 'FLOAT';
          break;
        case 'boolean':
          output[key] = 'BOOLEAN';
          break;
        case 'date':
          output[key] = 'DATE';
          break;
        case 'objectId':
          output[key] = 'OBJECTID';
          break;
        case 'nested':
          output[key] = renderJSON(children);
          break;
        default:
          // value = type || '';
      
        output[key] = type || '';
      }
    }

    return output;
  };

  return (
    <Row gutter={24} style={{ padding: 24 }}>
      <Col span={12}>
        <Card title="Schema Builder">
          <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            {fields.map((item, idx) => (
              <SchemaField
                key={item.id}
                fieldIndex={idx}
                nestPath={`schema.${idx}`}
                control={control}
                register={register}
                watch={watch}
                removeField={() => remove(idx)}
              />
            ))}
            <Button
              type="primary"
              onClick={handleAddField}
              icon={<PlusOutlined />}
              block
              style={{ marginTop: 16 }}
            >
              Add Field
            </Button>
            <Button
              htmlType="submit"
              type="dashed"
              
              style={{ marginTop: 12 }}
            >
              Submit
            </Button>
          </Form>
        </Card>
      </Col>

      <Col span={12}>
        <Card title="JSON Preview">
          <pre
            style={{
              background: '#f7f7f7',
              padding: 12,
              borderRadius: 4,
              maxHeight: '80vh',
              overflowY: 'auto',
              fontSize: 13,
              fontFamily: 'monospace',
            }}
          >
            {JSON.stringify(renderJSON(schemaValues), null, 2)}
          </pre>
        </Card>
      </Col>
    </Row>
  );
};

export default SchemaBuilder;
