# 测开面经 - 作业帮

---

## 一面

1. **自我介绍**
2. **项目介绍**

---

## 二面（40min）

1. **自我介绍**
2. **项目介绍**
3. **Linux 你常用的命令？**
4. **怎么查看文件的行数？** → `wc -l filename`
5. **怎么查找文件名带有 error 的文件？** → `find . -name "*error*"`
6. **SQL 查询计算机一班的平均成绩？三个表**
   ```sql
   SELECT AVG(sc.score) FROM student s JOIN score sc ON s.id = sc.stu_id JOIN class c ON s.class_id = c.id WHERE c.class_name = '计算机一班';
   ```
7. **数据库索引的作用？什么能加快？**
8. **编程题：给一个字符串 str="780900089898990" 计算和，如果遇到零与前面的数组成一个数**

---

## 高频考点汇总

| 类别 | 高频题 |
|------|--------|
| 操作系统 | Linux常用命令 |
| 数据库 | SQL查询、索引 |
| 编程 | 字符串处理 |
