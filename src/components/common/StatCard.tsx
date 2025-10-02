import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease';
  };
  icon: LucideIcon;
  color?: 'primary' | 'success' | 'warning' | 'destructive';
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'primary',
  className 
}: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    destructive: 'bg-destructive/10 text-destructive'
  };

  const changeColorClasses = {
    increase: 'text-success',
    decrease: 'text-destructive'
  };

  return (
    <Card className={cn("transition-hover hover:shadow-lg", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-foreground">
              {value}
            </p>
            {change && (
              <p className={cn(
                "text-xs font-medium mt-1",
                changeColorClasses[change.type]
              )}>
                {change.type === 'increase' ? '+' : '-'}{change.value}
              </p>
            )}
          </div>
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            colorClasses[color]
          )}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}