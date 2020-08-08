DELETE FROM [dbo].[Metrics] WHERE [IsSystem] = 1
GO

DBCC CHECKIDENT([Metrics], RESEED, 0)
GO

SET IDENTITY_INSERT [dbo].[Metrics] ON
GO

INSERT INTO [dbo].[Metrics] ([ID], [Name], [Type], [IsSystem])
VALUES
(-1, 'Weight', 5, 1),
(-2, 'Body Fat Percentage', 3, 1)
GO

SET IDENTITY_INSERT [dbo].[Metrics] OFF
GO
