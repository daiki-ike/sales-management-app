import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import App from './App';

// Layout is checked in a real browser; these tests cover CSV processing.
vi.mock('recharts', () => {
  const Box = ({ children }) => <div>{children}</div>;
  return {
    ResponsiveContainer: Box, LineChart: Box, BarChart: Box,
    Line: () => null, Bar: () => null, XAxis: () => null, YAxis: () => null,
    CartesianGrid: () => null, Tooltip: () => null, Legend: () => null,
  };
});
beforeEach(() => vi.spyOn(window, 'alert').mockImplementation(() => {}));
afterEach(cleanup);

test('renders CSV controls after the build-tool migration', () => {
  render(<App />);
  expect(screen.getByLabelText(/部門データを読み込む/)).toHaveAttribute('accept', '.csv');
  expect(screen.getByLabelText(/個人データを読み込む/)).toHaveAttribute('accept', '.csv');
  expect(screen.getByRole('button', { name: '売上順' })).toBeVisible();
});

test('imports department CSV and calculates the displayed totals', async () => {
  render(<App />);
  const file = new File(['date,sales,profit\n2026-01,1234,200\n2026-02,2345,300'], 'department.csv', { type: 'text/csv' });
  fireEvent.change(screen.getByLabelText(/部門データを読み込む/), { target: { files: [file] } });
  await waitFor(() => expect(window.alert).toHaveBeenCalled());
  expect(screen.getByText('¥3,579')).toBeVisible();
  expect(screen.getByText('¥500')).toBeVisible();
});

test('imports Japanese headers, switches ranking, and opens member detail', async () => {
  render(<App />);
  const file = new File(['氏名,日付,売上,粗利\nFixtureA,2026-01,1000,100\nFixtureB,2026-01,500,200'], 'members.csv', { type: 'text/csv' });
  fireEvent.change(screen.getByLabelText(/個人データを読み込む/), { target: { files: [file] } });
  await screen.findByText('FixtureA');
  const table = screen.getByRole('table');
  expect(within(table).getAllByRole('row')[1]).toHaveTextContent('FixtureA');
  fireEvent.click(screen.getByRole('button', { name: '粗利順' }));
  expect(within(table).getAllByRole('row')[1]).toHaveTextContent('FixtureB');
  fireEvent.click(within(within(table).getAllByRole('row')[1]).getByRole('button', { name: 'グラフ表示' }));
  expect(screen.getByRole('heading', { name: 'FixtureB の詳細' })).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: /閉じる/ }));
  expect(screen.queryByRole('heading', { name: 'FixtureB の詳細' })).toBeNull();
});
