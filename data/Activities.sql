DELETE FROM [dbo].[Activities] WHERE [IsSystem] = 1
GO

DBCC CHECKIDENT([Metrics], RESEED, 0)
GO

SET IDENTITY_INSERT [dbo].[Activities] ON
GO

INSERT INTO [dbo].[Activities] ([ID], [Name], [EstimatedCaloriesBurnedPerMinute], [MetricType], [IsSystem])
VALUES
(-1, 'Running', 12, 1, 1),
(-2, 'Biking', 10, 1, 1),
(-3, 'Swimming', 10, 1, 1),
(-4, 'Strength Training', 5, 0, 1)
GO

SET IDENTITY_INSERT [dbo].[Activities] OFF
GO
