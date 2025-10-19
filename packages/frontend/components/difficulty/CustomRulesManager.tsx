"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

export interface CustomRule {
	timeRange: number;
	threshold: number;
	difficulty: number;
}

interface CustomRulesManagerProps {
	customRules: CustomRule[];
	onCustomRulesChange: (rules: CustomRule[]) => void;
}

export function CustomRulesManager({ customRules, onCustomRulesChange }: CustomRulesManagerProps) {
	const [newRule, setNewRule] = useState<CustomRule>({
		timeRange: 0,
		threshold: 0,
		difficulty: 0
	});

	const addRule = () => {
		if (newRule.timeRange > 0 && newRule.threshold > 0 && newRule.difficulty > 0) {
			onCustomRulesChange([...customRules, newRule]);
			setNewRule({ timeRange: 0, threshold: 0, difficulty: 0 });
		}
	};

	const removeRule = (index: number) => {
		const updatedRules = customRules.filter((_, i) => i !== index);
		onCustomRulesChange(updatedRules);
	};

	const updateRule = (index: number, field: keyof CustomRule, value: number) => {
		const updatedRules = [...customRules];
		updatedRules[index] = { ...updatedRules[index], [field]: value };
		onCustomRulesChange(updatedRules);
	};

	return (
		<div className="space-y-4">
			<div>
				<Label className="text-lg font-medium">Custom Rules</Label>
				<p className="text-sm text-muted-foreground mb-4">
					Define custom difficulty rules based on time range and threshold
				</p>
			</div>

			{/* Add New Rule Form */}
			<Card className="gap-2">
				<CardHeader>
					<CardTitle className="text-base">Add New Rule</CardTitle>
				</CardHeader>
                
				<CardContent>
					<div className="flex flex-col gap-4">
						<div>
							<Label htmlFor="timeRange" className="mb-1.5">Time Range (seconds)</Label>
							<Input
								id="timeRange"
								type="number"
								value={newRule.timeRange || ""}
								onChange={(e) => setNewRule({ ...newRule, timeRange: parseInt(e.target.value) || 0 })}
								placeholder="Timerange"
								min="1"
							/>
						</div>
						<div>
							<Label htmlFor="threshold" className="mb-1.5">Threshold</Label>
							<Input
								id="threshold"
								type="number"
								value={newRule.threshold || ""}
								onChange={(e) => setNewRule({ ...newRule, threshold: parseInt(e.target.value) || 0 })}
								placeholder="Threshold"
								min="1"
							/>
						</div>
						<div>
							<Label htmlFor="difficulty" className="mb-1.5">Difficulty</Label>
							<Input
								id="difficulty"
								type="number"
								value={newRule.difficulty || ""}
								onChange={(e) => setNewRule({ ...newRule, difficulty: parseInt(e.target.value) || 0 })}
								placeholder="Difficulty"
								min="1"
							/>
						</div>
						<div className="flex items-end">
							<Button onClick={addRule} className="w-full" disabled={!newRule.timeRange || !newRule.threshold || !newRule.difficulty}>
								<Plus className="w-4 h-4 mr-2" />
								Add Rule
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Existing Rules */}
			{customRules.length > 0 && (
				<Card className="gap-2">
					<CardHeader>
						<CardTitle className="text-base">Current Rules ({customRules.length})</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{customRules.map((rule, index) => (
								<div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
										<div>
											<Label className="text-xs mb-1">Time Range</Label>
											<Input
												type="number"
												value={rule.timeRange}
												onChange={(e) => updateRule(index, "timeRange", parseInt(e.target.value) || 0)}
												min="1"
											/>
										</div>
										<div>
											<Label className="text-xs mb-1">Threshold</Label>
											<Input
												type="number"
												value={rule.threshold}
												onChange={(e) => updateRule(index, "threshold", parseInt(e.target.value) || 0)}
												min="1"
											/>
										</div>
										<div>
											<Label className="text-xs mb-1">Difficulty</Label>
											<Input
												type="number"
												value={rule.difficulty}
												onChange={(e) => updateRule(index, "difficulty", parseInt(e.target.value) || 0)}
												min="1"
											/>
										</div>
									</div>
									<Button
										variant="outline"
										size="sm"
										onClick={() => removeRule(index)}
										className="flex-shrink-0"
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}