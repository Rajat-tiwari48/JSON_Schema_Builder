import React from 'react';
import { useFieldArray, useController } from 'react-hook-form';
import { Input, Select, Button, Switch, Row, Col,Tooltip  } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const SchemaField = ({ nestPath, fieldIndex, control, register, watch, removeField  }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${nestPath}.children`,
  });

  const { field: nameField, fieldState: nameState } = useController({
    name: `${nestPath}.key`,
    control,
    rules: { required: 'Name required' },
  });

  const { field: typeField } = useController({
    name: `${nestPath}.type`,
    control,
  });

  const { field: requiredField } = useController({
    name: `${nestPath}.required`,
    control,
  });

  const type = watch(`${nestPath}.type`);
  const level = nestPath.split('.').filter(x => x !== 'children').length - 1;

   const handleRemove = () => {
    removeField(fieldIndex);
  };;

  return (
    <div
      style={{
        marginBottom: 12,
        padding: 10,
        border: '1px solid #ddd',
        borderRadius: 4,
        marginLeft: level * 20,
        background: '#fafafa',
      }}
    >
      <Row gutter={8} align="middle">
        <Col flex="auto">
          <Input
            {...nameField}
            placeholder="Field Name"
            status={nameState.error ? 'error' : ''}
          />
        </Col>
        <Col>
          <Select
            {...typeField}
            placeholder="Field Type"
            onChange={(val) => {
              
              typeField.onChange(val);
              if (val !== 'nested') remove();
            }}

            style={{ width: 120 , overflowY: 'auto' }}
             listHeight={128}
          >
            <Option value="nested">Nested</Option>
            <Option value="string">String</Option>
            <Option value="number">Number</Option>
            <Option value="objectId">ObjectId</Option>
            <Option value="float">Float</Option>
            <Option value="boolean">Boolean</Option>
            <Option value="date">Date</Option>
          </Select>
        </Col>
        <Col>
        <Tooltip title="Required">
          <Switch
            {...requiredField}
            checked={requiredField.value}
            onChange={requiredField.onChange}
            size="small"
            
          />
          </Tooltip>
        </Col>
        <Col>
          <Button
            type="text"
            onClick={handleRemove}
            style={{ fontSize: 30, fontWeight: 'bold' }}
          >
            ×
          </Button>
        </Col>
      </Row>

      {type === 'nested' && (
        <div style={{ marginTop: 10 }}>
          {fields.map((item, idx) => (
            <SchemaField
              key={item.id}
              fieldIndex={idx}
              nestPath={`${nestPath}.children.${idx}`}
              control={control}
              register={register}
              watch={watch}
              removeField={() => remove(idx)}
            />
          ))}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginTop: 10, width: '100%' }}
            onClick={() =>
              append({ key: '', type: undefined, required: false })
            }
          >
            Add Item
          </Button>
        </div>
      )}
    </div>
  );
};

export default SchemaField;
