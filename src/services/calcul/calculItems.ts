/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import { calculTypes } from "../../interfaces/IConfig";
import { INodeItemTree } from "../../interfaces/INodeItem";

export function calculItemsValue(data: INodeItemTree[], calculMode: calculTypes): INodeItemTree[] {
	return data.reduce((arr: INodeItemTree[], item) => {
		const values = item.children.map((el) => getValue(el));
		const value = calculateValue(values, calculMode);

		item.displayValue = isFinite(value) ? value : "-";
		arr.push(item);
		return arr;
	}, []);
}

export function getColor(item, legend) {
	const value = item.displayValue;

	if (isNaN(value)) return legend.min.color;

	if (!isFinite(value)) return value < 0 ? legend.min.color : legend.max.color;

	if (value == legend.min.value) return legend.min.color;
	if (legend.median && value == legend.median.value) return legend.median.color;
	if (value == legend.max.value) return legend.max.color;

	const percent25 = (legend.min.value + legend.median.value) / 2;
	if (value <= percent25) return legend.min.color;

	const percent75 = (legend.max.value + legend.median.value) / 2;
	if (value <= percent75) return legend.median.color;

	return legend.max.color;
}

function getValue(item: INodeItemTree) {
	item.displayValue = item.endpoint?.value?.toString() || item.endpoint?.currentValue?.toString() || "-";
	return item.displayValue;
}

export function calculateValue(arr: (string | number)[], calculMode: calculTypes): number {
	const nums = _filterAndconvertDataToNumber(arr);

	switch (calculMode) {
		case calculTypes.Maximum:
			return getMax(nums);
		case calculTypes.Minimum:
			return getMin(nums);
		case calculTypes.Somme:
			return getSum(nums);
		case calculTypes.Moyenne:
			return getMoyenne(nums);
		case calculTypes.MoyennePercent:
			return getMoyenne(nums) * 100;
	}
}

function getMax(arr: number[]) {
	return Math.max(...arr);
}

function getMin(arr: number[]) {
	return Math.min(...arr);
}

function getSum(arr: number[]) {
	return arr.reduce((sum, i) => {
		sum += i;
		return sum;
	}, 0);
}

function getMoyenne(arr: number[]) {
	const sum = getSum(arr);
	return sum / arr.length;
}

function _filterAndconvertDataToNumber(arr: (string | number)[]): number[] {
	return arr.reduce((list, i) => {
		//@ts-ignore
		if (!isNaN(i as any)) list.push(Number(i as any));
		return list;
	}, []);
}
