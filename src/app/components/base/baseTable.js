import { Table } from "antd"
import styled from "styled-components"

// 日程表table
export const BaseTable = styled(Table)`
  margin-top: 5px;
  .ant-table-thead {
    margin: 0 auto;
  }
  .ant-table-thead > tr {
    width: 100%;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table tfoot > tr > th,
  .ant-table tfoot > tr > td {
    text-align: center;
    padding: 4px 5px;
  }
  .ant-table-tbody td {
    border-bottom: 1px solid #eee;
  }
  .ant-table-thead > tr > th {
    background-color: #f6f6f6;
    font-weight: 400;
    padding: 5px;
    font-size: 14px;
  }
  .ant-table-row-selected {
    background-color: #fff;
  }
  .ant-table-tbody > tr > td {
    background: #fff !important;
  }
  .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
    background-color: #edf6fd !important;
  }
  .ant-table-body .ant-table-row-hover {
    background: #edf6fd !important;
  }
  .ant-table-body .ant-table-row-hover > td {
    background: #edf6fd !important;
  }
  table {
    border-collapse: collapse;
  }
  li {
    padding: 0 !important;
  }
`
export const TableSchedule = styled(BaseTable)`
  .ant-table-bordered .ant-table-header > table,
  .ant-table-bordered .ant-table-body > table,
  .ant-table-bordered .ant-table-fixed-left table,
  .ant-table-bordered .ant-table-fixed-right table {
    border-left: none;
  }
  .ant-table-fixed-header .ant-table-scroll .ant-table-header {
    overflow: hidden;
    height: 70px;
  }
  .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
    background-color: #edf6fd !important;
  }
  .ant-table-body .ant-table-row-hover {
    background: #edf6fd !important;
  }
  .ant-table-body .ant-table-row-hover > td {
    background: #edf6fd !important;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table tfoot > tr > th,
  .ant-table tfoot > tr > td {
    text-align: center;
    padding: 4px 2px;
  }
  .ant-table-bordered {
    .ant-table-thead > tr > th:last-child {
      border-right: none;
    }
    .ant-table-tbody > tr > td:last-child {
      border-right: none;
    }
  }
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-content
    > table
    > thead
    > tr:nth-child(1)
    > th,
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-header
    > table
    > thead
    > tr:nth-child(1)
    > th,
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-body
    > table
    > thead
    > tr:nth-child(1)
    > th {
    border-right: 1px solid #e2e2e2;
    background: #f6f6f6;
  }
`
export const TableNomargin = styled(BaseTable)`
  .ant-table-thead {
    margin: 0 auto;
  }
  .ant-table-thead > tr {
    width: 100%;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table tfoot > tr > th,
  .ant-table tfoot > tr > td {
    text-align: center;
    padding: 8px 10px;
  }
  .ant-table-tbody td {
    border-bottom: 1px solid #eee;
  }
  .ant-table-thead > tr > th {
    background-color: #f6f6f6;
    font-weight: 400;
    padding: 10px 5px;
    font-size: 14px;
  }
  .ant-table-row-selected {
    background-color: #fff;
  }
  .ant-table-tbody > tr > td {
    background: #fff !important;
  }
  .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
    background-color: #edf6fd !important;
  }
  .ant-table-body .ant-table-row-hover {
    background: #edf6fd !important;
  }
  .ant-table-body .ant-table-row-hover > td {
    background: #edf6fd !important;
  }
  table {
    border-collapse: collapse;
  }
  li {
    padding: 0 !important;
  }
`
